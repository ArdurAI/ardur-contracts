import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHEMA_VERSION,
  CONTRACT_REVISION,
  CYCLE_INTERVAL_MS,
  FORBIDDEN_METRIC_KEY_FRAGMENTS,
  assertCompatibleArtifact,
  SchemaVersionError,
  type ArtifactEnvelope,
  type AggregationData,
  type ExtractedFact,
  type FactProvenance,
  type SourceDocument,
  type ClaimProvenance,
  type TextBlock,
  type ChartBlock,
  type ImageBlock,
  type GifBlock,
  type EmbedBlock,
  type ArticleBlock,
  type MediaProvenance,
  type ScoreBreakdown,
  type RankedCluster,
  type Top10Entry,
  type SynthesizedArticle,
} from './index.ts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

function makeEnvelope(overrides: DeepPartial<ArtifactEnvelope<AggregationData>> = {}): unknown {
  return {
    schemaVersion: SCHEMA_VERSION,
    artifact: 'aggregation',
    runId: 'run-test-1',
    upstreamRunId: null,
    generatedAt: '2026-06-11T06:00:00.000Z',
    cycle: {
      id: '2026-06-11T06:00:00.000Z',
      windowStart: '2026-06-11T06:00:00.000Z',
      windowEnd: '2026-06-11T12:00:00.000Z',
    },
    topics: [],
    warnings: [],
    data: { itemsByTopic: {}, clustersByTopic: {}, coverageByTopic: {} },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('SCHEMA_VERSION', () => {
  it('is the correct literal string', () => {
    assert.strictEqual(SCHEMA_VERSION, 'ardur-content-pipeline/v1');
  });
});

describe('CONTRACT_REVISION', () => {
  it('is 3 (rev 3 adds fact/provenance layer, visual blocks, uncapped source set)', () => {
    assert.strictEqual(CONTRACT_REVISION, 3);
  });
});

describe('CYCLE_INTERVAL_MS', () => {
  it('is 6 hours in milliseconds', () => {
    assert.strictEqual(CYCLE_INTERVAL_MS, 6 * 60 * 60 * 1000);
  });
});

describe('FORBIDDEN_METRIC_KEY_FRAGMENTS', () => {
  it('is a non-empty readonly array of strings', () => {
    assert.ok(Array.isArray(FORBIDDEN_METRIC_KEY_FRAGMENTS));
    assert.ok(FORBIDDEN_METRIC_KEY_FRAGMENTS.length > 0);
    for (const f of FORBIDDEN_METRIC_KEY_FRAGMENTS) {
      assert.strictEqual(typeof f, 'string');
    }
  });

  it('includes key privacy-sensitive fragments', () => {
    const set = new Set(FORBIDDEN_METRIC_KEY_FRAGMENTS);
    assert.ok(set.has('email'));
    assert.ok(set.has('session'));
    assert.ok(set.has('token'));
    assert.ok(set.has('userid'));
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — happy paths
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — happy paths', () => {
  it('passes for a valid aggregation envelope', () => {
    const result = assertCompatibleArtifact(makeEnvelope(), 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
    assert.strictEqual(result.stage, 'aggregation');
    assert.strictEqual(
      (result.envelope as ArtifactEnvelope<AggregationData>).schemaVersion,
      SCHEMA_VERSION,
    );
  });

  it('passes for all four pipeline stages', () => {
    const stages = ['aggregation', 'ranking', 'top10', 'articles'] as const;
    for (const stage of stages) {
      const result = assertCompatibleArtifact(makeEnvelope({ artifact: stage }), stage);
      assert.strictEqual(result.warnings.length, 0, `stage=${stage} should have no warnings`);
      assert.strictEqual(result.stage, stage);
    }
  });

  it('passes with contractRevision === CONTRACT_REVISION (no warning)', () => {
    const result = assertCompatibleArtifact(
      makeEnvelope({ contractRevision: CONTRACT_REVISION }),
      'aggregation',
    );
    assert.strictEqual(result.warnings.length, 0);
  });

  it('passes with contractRevision < CONTRACT_REVISION (no warning)', () => {
    const result = assertCompatibleArtifact(makeEnvelope({ contractRevision: 1 }), 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
  });

  it('passes without contractRevision — treated as rev 1 (no warning)', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['contractRevision'];
    const result = assertCompatibleArtifact(env, 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
  });

  it('returns envelope reference pointing to the original object', () => {
    const raw = makeEnvelope();
    const { envelope } = assertCompatibleArtifact(raw, 'aggregation');
    assert.strictEqual(envelope, raw);
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — forward-compat warning
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — forward-compat warning', () => {
  it('warns when upstream contractRevision > CONTRACT_REVISION', () => {
    const result = assertCompatibleArtifact(
      makeEnvelope({ contractRevision: CONTRACT_REVISION + 1 }),
      'aggregation',
    );
    assert.strictEqual(result.warnings.length, 1);
    const [warning] = result.warnings;
    assert.ok(warning?.includes('forward-compatible'), `warning text: "${warning}"`);
    assert.ok(warning?.includes(String(CONTRACT_REVISION + 1)));
    assert.ok(warning?.includes(String(CONTRACT_REVISION)));
  });

  it('warns and still returns a valid envelope (no throw on forward-compat)', () => {
    const result = assertCompatibleArtifact(makeEnvelope({ contractRevision: 99 }), 'aggregation');
    assert.strictEqual(result.warnings.length, 1);
    assert.ok(result.envelope !== null);
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — hard failures
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — hard failures (SchemaVersionError)', () => {
  it('throws on null input', () => {
    assert.throws(
      () => assertCompatibleArtifact(null, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on non-object input (string)', () => {
    assert.throws(
      () => assertCompatibleArtifact('not-an-object', 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on non-object input (number)', () => {
    assert.throws(
      () => assertCompatibleArtifact(42, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on missing schemaVersion', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['schemaVersion'];
    assert.throws(
      () => assertCompatibleArtifact(env, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on wrong schemaVersion (v2)', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ schemaVersion: 'ardur-content-pipeline/v2' as typeof SCHEMA_VERSION }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on wrong artifact stage', () => {
    assert.throws(
      () => assertCompatibleArtifact(makeEnvelope({ artifact: 'ranking' }), 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is null', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ data: null as unknown as AggregationData }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is missing', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['data'];
    assert.throws(
      () => assertCompatibleArtifact(env, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is a primitive (string)', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ data: 'not-an-object' as unknown as AggregationData }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });
});

// ---------------------------------------------------------------------------
// SchemaVersionError
// ---------------------------------------------------------------------------

describe('SchemaVersionError', () => {
  it('is an instance of Error', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 'other',
      stage: 'aggregation',
    });
    assert.ok(err instanceof Error);
    assert.ok(err instanceof SchemaVersionError);
  });

  it('has name = "SchemaVersionError"', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: null,
      stage: 'ranking',
    });
    assert.strictEqual(err.name, 'SchemaVersionError');
  });

  it('message includes stage, expected, and received', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 'ardur-content-pipeline/v2',
      stage: 'top10',
    });
    assert.ok(err.message.includes('top10'), `message: "${err.message}"`);
    assert.ok(err.message.includes(SCHEMA_VERSION), `message: "${err.message}"`);
    assert.ok(err.message.includes('v2'), `message: "${err.message}"`);
  });

  it('detail object is accessible and matches constructor args', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 42,
      stage: 'articles',
    });
    assert.strictEqual(err.detail.expected, SCHEMA_VERSION);
    assert.strictEqual(err.detail.received, 42);
    assert.strictEqual(err.detail.stage, 'articles');
  });

  it('is catchable as Error', () => {
    let caught: unknown;
    try {
      throw new SchemaVersionError({ expected: 'v1', received: 'v2', stage: 'ranking' });
    } catch (e) {
      caught = e;
    }
    assert.ok(caught instanceof Error);
    assert.ok(caught instanceof SchemaVersionError);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — type exports (structural checks via assignability)
// ---------------------------------------------------------------------------

describe('Rev 3 — exported types are assignable at runtime', () => {
  it('SourceDocument fields are structurally correct', () => {
    const doc: SourceDocument = {
      id: 'doc-1',
      url: 'https://reuters.com/article',
      source: 'Reuters',
      sourceDomain: 'reuters.com',
      tier: 'news',
      title: 'AI progress in 2026',
      publishedAt: '2026-06-11T04:00:00.000Z',
      fetchedAt: '2026-06-11T05:00:00.000Z',
      extraction: 'full',
      accessPolicy: 'allowed',
      wordCount: 800,
      lang: 'en',
      contentHash: 'abc123',
    };
    assert.strictEqual(doc.extraction, 'full');
    assert.strictEqual(doc.accessPolicy, 'allowed');
  });

  it('FactProvenance and ExtractedFact fields are structurally correct', () => {
    const prov: FactProvenance = {
      sourceDocId: 'doc-1',
      sourceDomain: 'reuters.com',
      url: 'https://reuters.com/article',
      quote: 'Less than 25 words verbatim here.',
    };
    const fact: ExtractedFact = {
      id: 'fact-1',
      topic: 'ai',
      clusterId: 'cluster-ai-1',
      statement: 'AI model efficiency improved by 40% year-over-year.',
      quantity: { metric: 'efficiency_improvement', value: 40, unit: '%', asOf: '2026-Q1' },
      entities: ['AI', 'model efficiency'],
      provenance: [prov],
      corroboration: 1,
      confidence: 'high',
      extractedBy: {
        provider: 'ollama',
        model: 'llama3.2',
        status: 'generated',
        generatedAt: '2026-06-11T05:30:00.000Z',
      },
    };
    assert.strictEqual(fact.provenance.length, 1);
    assert.strictEqual(fact.quantity?.value, 40);
  });

  it('MediaProvenance covers generated and openly-licensed origins', () => {
    const gen: MediaProvenance = { origin: 'generated' };
    const lic: MediaProvenance = { origin: 'openly-licensed', license: 'CC0', creator: 'Unsplash' };
    assert.strictEqual(gen.origin, 'generated');
    assert.strictEqual(lic.license, 'CC0');
  });

  it('ArticleBlock union covers all five variants', () => {
    const text: ArticleBlock = { type: 'paragraph', text: 'Hello.' };
    const heading: ArticleBlock = { type: 'heading', text: 'Section' };
    const chart: ArticleBlock = {
      type: 'chart',
      chartType: 'bar',
      title: 'Efficiency gains',
      series: [
        { label: '2025', value: 30, unit: '%' },
        { label: '2026', value: 40, unit: '%' },
      ],
      factIds: ['fact-1'],
      attribution: { sources: [{ source: 'Reuters', url: 'https://reuters.com/article' }] },
    };
    const image: ArticleBlock = {
      type: 'image',
      src: 'https://example.com/img.jpg',
      alt: 'A diagram',
      media: { origin: 'openly-licensed', license: 'CC-BY-4.0' },
    };
    const gif: ArticleBlock = {
      type: 'gif',
      src: 'https://example.com/anim.gif',
      alt: 'Animation',
      media: { origin: 'generated' },
    };
    const embed: ArticleBlock = {
      type: 'embed',
      provider: 'youtube',
      url: 'https://youtube.com/watch?v=abc',
      title: 'Demo video',
    };
    assert.strictEqual(text.type, 'paragraph');
    assert.strictEqual(heading.type, 'heading');
    assert.strictEqual((chart as ChartBlock).chartType, 'bar');
    assert.strictEqual((image as ImageBlock).media.origin, 'openly-licensed');
    assert.strictEqual((gif as GifBlock).media.origin, 'generated');
    assert.strictEqual((embed as EmbedBlock).provider, 'youtube');
  });

  it('TextBlock and ChartBlock are named exports (not just the union)', () => {
    const tb: TextBlock = { type: 'callout', text: 'Note.' };
    const cb: ChartBlock = {
      type: 'chart',
      chartType: 'line',
      title: 'Trend',
      series: [{ label: 'Jan', value: 10 }],
      factIds: ['f-1'],
      attribution: { sources: [] },
    };
    assert.strictEqual(tb.type, 'callout');
    assert.strictEqual(cb.type, 'chart');
  });

  it('ScoreBreakdown.technicalSignificance is optional (rev 3 additive)', () => {
    const rev2score: ScoreBreakdown = {
      interaction: 0.5,
      credibility: 0.8,
      corroboration: 0.7,
      recency: 0.9,
      diversity: 0.6,
      total: 0.74,
      weights: { interaction: 0.2 },
    };
    assert.strictEqual(rev2score.technicalSignificance, undefined);

    const rev3score: ScoreBreakdown = { ...rev2score, technicalSignificance: 0.85 };
    assert.strictEqual(rev3score.technicalSignificance, 0.85);
  });

  it('RankedCluster rev 3 optional fields are absent-safe', () => {
    const cluster: RankedCluster = {
      clusterId: 'c-1',
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI news',
      rank: 1,
      score: {
        interaction: 0.5,
        credibility: 0.8,
        corroboration: 0.7,
        recency: 0.9,
        diversity: 0.6,
        total: 0.74,
        weights: {},
      },
      sourceQuality: 'corroborated',
      confidence: 'high',
      verification: 'multi-source',
      sourceCount: 3,
      distinctDomains: 3,
      tierHistogram: { news: 3 },
      memberIds: ['i-1'],
      earliestPublishedAt: '2026-06-11T03:00:00.000Z',
      latestPublishedAt: '2026-06-11T05:00:00.000Z',
      auditId: 'audit-1',
    };
    assert.strictEqual(cluster.references, undefined);
    assert.strictEqual(cluster.sourceDocIds, undefined);
    assert.strictEqual(cluster.gateStatus, undefined);

    const rev3cluster: RankedCluster = {
      ...cluster,
      references: [
        {
          source: 'Reuters',
          sourceDomain: 'reuters.com',
          tier: 'news',
          url: 'https://reuters.com/a',
          title: 'AI',
          publishedAt: '2026-06-11T04:00:00.000Z',
        },
      ],
      sourceDocIds: ['doc-1'],
      gateStatus: 'auto',
    };
    assert.strictEqual(rev3cluster.gateStatus, 'auto');
    assert.strictEqual(rev3cluster.references?.length, 1);
  });

  it('Top10Entry.sourceDocIds is optional (rev 3 additive)', () => {
    const entry: Top10Entry = {
      rank: 1,
      clusterId: 'c-1',
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI news',
      score: {
        interaction: 0.5,
        credibility: 0.8,
        corroboration: 0.7,
        recency: 0.9,
        diversity: 0.6,
        total: 0.74,
        weights: {},
      },
      sourceQuality: 'corroborated',
      confidence: 'high',
      references: [],
      delta: { previousRank: null, movement: 'new' },
      carriedOver: false,
    };
    assert.strictEqual(entry.sourceDocIds, undefined);

    const rev3entry: Top10Entry = { ...entry, sourceDocIds: ['doc-1', 'doc-2'] };
    assert.strictEqual(rev3entry.sourceDocIds?.length, 2);
  });

  it('ClaimProvenance fields are structurally correct', () => {
    const claim: ClaimProvenance = {
      blockIndex: 2,
      text: 'AI model efficiency improved by 40% year-over-year.',
      isEditorial: false,
      factIds: ['fact-1', 'fact-2'],
      corroboration: 2,
      confidence: 'high',
    };
    assert.strictEqual(claim.isEditorial, false);
    assert.strictEqual(claim.factIds.length, 2);
  });

  it('SynthesizedArticle rev 3 optional fields are absent-safe', () => {
    const article: SynthesizedArticle = {
      id: 'art-1',
      rank: 1,
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI progress',
      dek: 'A look at AI in 2026.',
      body: [{ type: 'paragraph', text: 'Body text.' }],
      keyPoints: ['Point one'],
      whyItMatters: 'Affects everyone.',
      readerAction: 'Read the linked papers.',
      tags: ['ai'],
      confidence: 'high',
      sourceQuality: 'corroborated',
      references: [],
      provenance: { clusterId: 'c-1', sourceCount: 3, distinctDomains: 3, upstreamRunId: 'run-1' },
      ai: {
        provider: 'deterministic',
        model: 'deterministic@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:00:00.000Z',
      },
      legalNote: 'Original text only.',
      wordCount: 320,
      readingTimeMinutes: 2,
      generatedAt: '2026-06-11T06:00:00.000Z',
    };
    assert.strictEqual(article.editorialStatus, undefined);
    assert.strictEqual(article.facts, undefined);
    assert.strictEqual(article.claims, undefined);

    const rev3article: SynthesizedArticle = {
      ...article,
      editorialStatus: 'published',
      claims: [
        {
          blockIndex: 0,
          text: 'Body text.',
          isEditorial: false,
          factIds: ['f-1'],
          corroboration: 1,
          confidence: 'high',
        },
      ],
    };
    assert.strictEqual(rev3article.editorialStatus, 'published');
    assert.strictEqual(rev3article.claims?.length, 1);
  });
});

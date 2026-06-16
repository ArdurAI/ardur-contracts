import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AggregationArtifactSchema,
  RankingArtifactSchema,
  Top10ArtifactSchema,
  ArticleArtifactSchema,
  SourceDocumentSchema,
  FactProvenanceSchema,
  ExtractedFactSchema,
  MediaProvenanceSchema,
  ClaimProvenanceSchema,
  TextBlockSchema,
  ChartBlockSchema,
  ImageBlockSchema,
  GifBlockSchema,
  EmbedBlockSchema,
  ArticleBlockSchema,
  parseArtifact,
  parseAggregationArtifact,
  parseRankingArtifact,
  parseTop10Artifact,
  parseArticleArtifact,
} from './zod.ts';
import { SCHEMA_VERSION, SchemaVersionError } from './index.ts';

// ---------------------------------------------------------------------------
// Minimal valid fixture factories
// ---------------------------------------------------------------------------

const CYCLE = {
  id: '2026-06-11T06:00:00.000Z',
  windowStart: '2026-06-11T06:00:00.000Z',
  windowEnd: '2026-06-11T12:00:00.000Z',
};

function baseEnvelope(artifact: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: SCHEMA_VERSION,
    artifact,
    runId: `run-${artifact}-1`,
    upstreamRunId: artifact === 'aggregation' ? null : `run-upstream-1`,
    generatedAt: '2026-06-11T06:00:30.000Z',
    cycle: CYCLE,
    topics: [],
    warnings: [],
    ...overrides,
  };
}

function makeAggArtifact(overrides: Record<string, unknown> = {}) {
  return {
    ...baseEnvelope('aggregation'),
    data: {
      itemsByTopic: {},
      clustersByTopic: {},
      coverageByTopic: {},
    },
    ...overrides,
  };
}

function makeRankingArtifact(overrides: Record<string, unknown> = {}) {
  return {
    ...baseEnvelope('ranking'),
    data: {
      rankedByTopic: {},
      audit: [],
      weightProfile: 'balanced@v1',
    },
    ...overrides,
  };
}

function makeTop10Artifact(overrides: Record<string, unknown> = {}) {
  return {
    ...baseEnvelope('top10'),
    data: {
      nextRefreshAt: '2026-06-11T12:00:00.000Z',
      topicsCovered: [],
      top10ByTopic: {},
      global: [],
      stability: { carriedOver: 0, fresh: 0, churnRate: 0 },
    },
    ...overrides,
  };
}

function makeArticleArtifact(overrides: Record<string, unknown> = {}) {
  return {
    ...baseEnvelope('articles'),
    data: {
      articles: [],
      copyrightPolicy: {
        originalTextOnly: true,
        maxQuoteWords: 25,
        reproduceArticleBody: false,
        requireAttribution: true,
        requireCanonicalLinks: true,
      },
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// AggregationArtifactSchema
// ---------------------------------------------------------------------------

describe('AggregationArtifactSchema', () => {
  it('parses a minimal valid aggregation artifact', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects wrong schemaVersion', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({ schemaVersion: 'ardur-content-pipeline/v2' }),
    );
    assert.ok(!result.success);
  });

  it('rejects wrong artifact type', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact({ artifact: 'ranking' }));
    assert.ok(!result.success);
  });

  it('parses with contractRevision field (additive)', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact({ contractRevision: 2 }));
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a full AggregatedItem with claims[] (rev 2 additive field)', () => {
    const item = {
      id: 'item-1',
      topic: 'ai',
      topicLabel: 'AI',
      title: 'AI advances continue in 2026',
      source: 'Reuters',
      sourceDomain: 'reuters.com',
      sourceUrl: 'https://reuters.com',
      url: 'https://reuters.com/technology/ai-advances-2026',
      tier: 'news',
      publishedAt: '2026-06-11T04:00:00.000Z',
      summaryHint: 'Significant AI progress reported.',
      interaction: {
        feedRank: 0,
        shares: null,
        comments: 42,
        reactions: null,
        crossSourceMentions: 3,
        velocity: 1.5,
        capturedAt: '2026-06-11T05:30:00.000Z',
        provenance: 'rss-position',
      },
      clusterId: 'cluster-ai-1',
      fingerprint: 'ai-advances-reuters-2026',
      claims: ['artificial intelligence', 'machine learning', 'GPT'],
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: {
          itemsByTopic: { ai: [item] },
          clustersByTopic: {
            ai: [
              {
                clusterId: 'cluster-ai-1',
                topic: 'ai',
                topicLabel: 'AI',
                headline: 'AI advances continue in 2026',
                memberIds: ['item-1'],
                sourceCount: 1,
                distinctDomains: 1,
                tierHistogram: { news: 1 },
                earliestPublishedAt: '2026-06-11T04:00:00.000Z',
                latestPublishedAt: '2026-06-11T04:00:00.000Z',
              },
            ],
          },
          coverageByTopic: {
            ai: {
              sourcesConfigured: 20,
              sourcesQueried: 18,
              sourcesResponded: 15,
              distinctDomains: 12,
              degraded: false,
            },
          },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses an AggregatedItem without claims[] (rev 1 backward-compat)', () => {
    const item = {
      id: 'item-2',
      topic: 'security',
      topicLabel: 'Security',
      title: 'New vulnerability found',
      source: 'The Hacker News',
      sourceDomain: 'thehackernews.com',
      sourceUrl: 'https://thehackernews.com',
      url: 'https://thehackernews.com/vuln-2026',
      tier: 'security-news',
      publishedAt: '2026-06-11T03:00:00.000Z',
      summaryHint: 'Critical vulnerability in popular library.',
      interaction: {
        feedRank: 1,
        shares: null,
        comments: null,
        reactions: null,
        crossSourceMentions: 1,
        velocity: null,
        capturedAt: '2026-06-11T05:00:00.000Z',
        provenance: 'rss-position',
      },
      clusterId: 'cluster-sec-1',
      fingerprint: 'vuln-thehackernews-2026',
      // no claims field
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: {
          itemsByTopic: { security: [item] },
          clustersByTopic: {},
          coverageByTopic: {},
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects missing required data field', () => {
    const artifact = makeAggArtifact();
    const { data: _removed, ...noData } = artifact as Record<string, unknown>;
    const result = AggregationArtifactSchema.safeParse(noData);
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// RankingArtifactSchema
// ---------------------------------------------------------------------------

describe('RankingArtifactSchema', () => {
  it('parses a minimal valid ranking artifact', () => {
    const result = RankingArtifactSchema.safeParse(makeRankingArtifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects wrong schemaVersion', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({ schemaVersion: 'ardur-content-pipeline/v2' }),
    );
    assert.ok(!result.success);
  });

  it('parses a full ranked cluster with score breakdown', () => {
    const rankedCluster = {
      clusterId: 'cluster-ai-1',
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI advances in 2026',
      rank: 1,
      score: {
        interaction: 0.8,
        credibility: 0.9,
        recency: 0.7,
        diversity: 0.85,
        corroboration: 0.75,
        total: 0.8,
        weights: {
          interaction: 0.2,
          credibility: 0.3,
          recency: 0.2,
          diversity: 0.15,
          corroboration: 0.15,
        },
      },
      sourceQuality: 'corroborated',
      confidence: 'high',
      verification: 'multi-source',
      sourceCount: 3,
      distinctDomains: 3,
      tierHistogram: { news: 2, primary: 1 },
      memberIds: ['item-1', 'item-2'],
      earliestPublishedAt: '2026-06-11T03:00:00.000Z',
      latestPublishedAt: '2026-06-11T05:00:00.000Z',
      auditId: 'audit-1',
    };
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [rankedCluster] },
          audit: [
            {
              auditId: 'audit-1',
              clusterId: 'cluster-ai-1',
              topic: 'ai',
              inputs: { feedRank: 0.8, crossSourceMentions: 3 },
              weights: { interaction: 0.2 },
              computed: rankedCluster.score,
              rationale: 'High credibility sources, strong corroboration.',
              weightProfile: 'balanced@v1',
              rankedAt: '2026-06-11T06:00:15.000Z',
            },
          ],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// Top10ArtifactSchema
// ---------------------------------------------------------------------------

describe('Top10ArtifactSchema', () => {
  it('parses a minimal valid top10 artifact', () => {
    const result = Top10ArtifactSchema.safeParse(makeTop10Artifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects wrong schemaVersion', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({ schemaVersion: 'ardur-content-pipeline/v2' }),
    );
    assert.ok(!result.success);
  });

  it('parses a full Top10Entry with delta and references', () => {
    const entry = {
      rank: 1,
      clusterId: 'cluster-ai-1',
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI advances in 2026',
      score: {
        interaction: 0.8,
        credibility: 0.9,
        recency: 0.7,
        diversity: 0.85,
        corroboration: 0.75,
        total: 0.8,
        weights: {},
      },
      sourceQuality: 'corroborated',
      confidence: 'high',
      references: [
        {
          source: 'Reuters',
          sourceDomain: 'reuters.com',
          tier: 'news',
          url: 'https://reuters.com/article',
          title: 'AI article',
          publishedAt: '2026-06-11T04:00:00.000Z',
        },
      ],
      delta: { previousRank: 2, movement: 'up' },
      carriedOver: false,
    };
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: ['ai'],
          top10ByTopic: { ai: [entry] },
          global: [entry],
          stability: { carriedOver: 1, fresh: 0, churnRate: 0.0 },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects a Top10Entry with rank out of range', () => {
    const badEntry = {
      rank: 11, // invalid: must be 1..10
      clusterId: 'c1',
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'headline',
      score: {
        interaction: 0,
        credibility: 0,
        recency: 0,
        diversity: 0,
        corroboration: 0,
        total: 0,
        weights: {},
      },
      sourceQuality: 'single source',
      confidence: 'low',
      references: [],
      delta: { previousRank: null, movement: 'new' },
      carriedOver: false,
    };
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: [],
          top10ByTopic: {},
          global: [badEntry],
          stability: { carriedOver: 0, fresh: 1, churnRate: 1.0 },
        },
      }),
    );
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// ArticleArtifactSchema
// ---------------------------------------------------------------------------

describe('ArticleArtifactSchema', () => {
  it('parses a minimal valid article artifact (empty articles array)', () => {
    const result = ArticleArtifactSchema.safeParse(makeArticleArtifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects wrong schemaVersion', () => {
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({ schemaVersion: 'ardur-content-pipeline/v2' }),
    );
    assert.ok(!result.success);
  });

  it('parses a full SynthesizedArticle', () => {
    const article = {
      id: 'article-1',
      rank: 1,
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI Progress: What 2026 Brings',
      dek: 'An independent look at recent AI developments.',
      body: [
        { type: 'heading', text: 'Introduction' },
        { type: 'paragraph', text: 'AI has seen remarkable progress.' },
        { type: 'list', items: ['Point one', 'Point two'] },
        {
          type: 'quote',
          text: 'Innovation accelerates.',
          attribution: { source: 'Reuters', url: 'https://reuters.com/article' },
        },
        { type: 'callout', text: 'Key insight: model efficiency doubled.' },
      ],
      keyPoints: ['Efficiency gains', 'New benchmarks'],
      whyItMatters: 'Advances affect developer productivity.',
      readerAction: 'Review the linked papers for technical details.',
      tags: ['ai', 'machine-learning', '2026'],
      confidence: 'high',
      sourceQuality: 'corroborated',
      references: [
        {
          source: 'Reuters',
          sourceDomain: 'reuters.com',
          tier: 'news',
          url: 'https://reuters.com/article',
          title: 'AI article',
          publishedAt: '2026-06-11T04:00:00.000Z',
        },
      ],
      provenance: {
        clusterId: 'cluster-ai-1',
        sourceCount: 3,
        distinctDomains: 3,
        upstreamRunId: 'run-top10-1',
      },
      ai: {
        provider: 'deterministic',
        model: 'deterministic@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:04:00.000Z',
      },
      legalNote:
        'Original text only. All quotes < 25 words with attribution. No article bodies reproduced.',
      wordCount: 320,
      readingTimeMinutes: 2,
      generatedAt: '2026-06-11T06:04:00.000Z',
    };
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        data: {
          articles: [article],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: false,
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses Hermes as a valid article synthesis provider', () => {
    const article = {
      id: 'article-hermes-1',
      rank: 1,
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'Hermes-powered AI brief',
      dek: 'A contract-valid Hermes-generated article.',
      body: [{ type: 'paragraph', text: 'Hermes output was validated before publication.' }],
      keyPoints: ['Hermes provider metadata is contract-valid'],
      whyItMatters: 'Provider provenance stays explicit.',
      readerAction: 'Inspect the source trail.',
      tags: ['ai', 'hermes'],
      confidence: 'high',
      sourceQuality: 'corroborated',
      references: [],
      provenance: {
        clusterId: 'cluster-ai-1',
        sourceCount: 2,
        distinctDomains: 2,
        upstreamRunId: 'run-top10-1',
      },
      ai: {
        provider: 'hermes',
        model: 'hermes-agent',
        status: 'generated',
        generatedAt: '2026-06-11T06:04:00.000Z',
      },
      legalNote: 'Original text only.',
      wordCount: 120,
      readingTimeMinutes: 1,
      generatedAt: '2026-06-11T06:04:00.000Z',
    };

    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        provider: {
          provider: 'hermes',
          model: 'hermes-agent',
          status: 'generated',
          generatedAt: '2026-06-11T06:04:00.000Z',
        },
        data: {
          articles: [article],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: false,
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );

    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid copyrightPolicy (reproduceArticleBody = true)', () => {
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        data: {
          articles: [],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: true, // must be false
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Cross-schema: passthrough preserves unknown fields
// ---------------------------------------------------------------------------

describe('passthrough — forward-compat with unknown fields', () => {
  it('AggregationArtifactSchema preserves unknown envelope fields', () => {
    const artifact = makeAggArtifact({ unknownFutureField: 'preserved' });
    const result = AggregationArtifactSchema.safeParse(artifact);
    assert.ok(result.success);
    assert.strictEqual((result.data as Record<string, unknown>)['unknownFutureField'], 'preserved');
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — SourceDocumentSchema
// ---------------------------------------------------------------------------

describe('SourceDocumentSchema', () => {
  const validDoc = {
    id: 'doc-1',
    url: 'https://reuters.com/article',
    source: 'Reuters',
    sourceDomain: 'reuters.com',
    tier: 'news',
    title: 'AI Progress in 2026',
    publishedAt: '2026-06-11T04:00:00.000Z',
    fetchedAt: '2026-06-11T05:00:00.000Z',
    extraction: 'full',
    accessPolicy: 'allowed',
    wordCount: 800,
    lang: 'en',
    contentHash: 'sha256-abc123',
  };

  it('parses a valid SourceDocument', () => {
    const result = SourceDocumentSchema.safeParse(validDoc);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses with wordCount null and lang null (paywalled/snippet case)', () => {
    const result = SourceDocumentSchema.safeParse({
      ...validDoc,
      extraction: 'snippet',
      accessPolicy: 'paywalled',
      wordCount: null,
      lang: null,
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses failed extraction with robots-disallowed', () => {
    const result = SourceDocumentSchema.safeParse({
      ...validDoc,
      extraction: 'failed',
      accessPolicy: 'robots-disallowed',
      wordCount: null,
      lang: null,
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid extraction status', () => {
    const result = SourceDocumentSchema.safeParse({ ...validDoc, extraction: 'partial' });
    assert.ok(!result.success);
  });

  it('rejects invalid accessPolicy', () => {
    const result = SourceDocumentSchema.safeParse({ ...validDoc, accessPolicy: 'unknown' });
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — FactProvenanceSchema + ExtractedFactSchema
// ---------------------------------------------------------------------------

describe('FactProvenanceSchema', () => {
  it('parses with optional quote', () => {
    const result = FactProvenanceSchema.safeParse({
      sourceDocId: 'doc-1',
      sourceDomain: 'reuters.com',
      url: 'https://reuters.com/article',
      quote: 'Less than 25 words.',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses without quote field', () => {
    const result = FactProvenanceSchema.safeParse({
      sourceDocId: 'doc-1',
      sourceDomain: 'reuters.com',
      url: 'https://reuters.com/article',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('ExtractedFactSchema', () => {
  const validProvenance = {
    sourceDocId: 'doc-1',
    sourceDomain: 'reuters.com',
    url: 'https://reuters.com/article',
  };
  const validFact = {
    id: 'fact-1',
    topic: 'ai',
    clusterId: 'cluster-ai-1',
    statement: 'AI model efficiency improved by 40% year-over-year.',
    entities: ['AI', 'model efficiency'],
    provenance: [validProvenance],
    corroboration: 1,
    confidence: 'high',
    extractedBy: {
      provider: 'ollama',
      model: 'llama3.2',
      status: 'generated',
      generatedAt: '2026-06-11T05:30:00.000Z',
    },
  };

  it('parses a valid ExtractedFact without quantity', () => {
    const result = ExtractedFactSchema.safeParse(validFact);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses Hermes as a valid fact extraction provider', () => {
    const result = ExtractedFactSchema.safeParse({
      ...validFact,
      extractedBy: {
        provider: 'hermes',
        model: 'hermes-agent',
        status: 'generated',
        generatedAt: '2026-06-11T05:30:00.000Z',
      },
    });

    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects an unknown fact extraction provider', () => {
    const result = ExtractedFactSchema.safeParse({
      ...validFact,
      extractedBy: {
        provider: 'not-a-provider',
        model: 'unknown',
        status: 'generated',
        generatedAt: '2026-06-11T05:30:00.000Z',
      },
    });

    assert.ok(!result.success);
  });

  it('parses a valid ExtractedFact with quantity', () => {
    const result = ExtractedFactSchema.safeParse({
      ...validFact,
      quantity: { metric: 'efficiency_improvement', value: 40, unit: '%', asOf: '2026-Q1' },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a quantitative fact with optional unit and asOf absent', () => {
    const result = ExtractedFactSchema.safeParse({
      ...validFact,
      quantity: { metric: 'model_count', value: 5 },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects a fact with empty provenance array', () => {
    const result = ExtractedFactSchema.safeParse({ ...validFact, provenance: [] });
    assert.ok(!result.success);
  });

  it('rejects a fact with corroboration < 1', () => {
    const result = ExtractedFactSchema.safeParse({ ...validFact, corroboration: 0 });
    assert.ok(!result.success);
  });

  it('rejects invalid confidence value', () => {
    const result = ExtractedFactSchema.safeParse({ ...validFact, confidence: 'very-high' });
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — AggregationArtifact with documentsByTopic + factsByCluster
// ---------------------------------------------------------------------------

describe('AggregationArtifactSchema — rev 3 additive fields', () => {
  it('parses with documentsByTopic and factsByCluster (rev 3 producer)', () => {
    const doc = {
      id: 'doc-1',
      url: 'https://reuters.com/article',
      source: 'Reuters',
      sourceDomain: 'reuters.com',
      tier: 'news',
      title: 'AI Progress',
      publishedAt: '2026-06-11T04:00:00.000Z',
      fetchedAt: '2026-06-11T05:00:00.000Z',
      extraction: 'full',
      accessPolicy: 'allowed',
      wordCount: 800,
      lang: 'en',
      contentHash: 'abc123',
    };
    const fact = {
      id: 'fact-1',
      topic: 'ai',
      clusterId: 'cluster-ai-1',
      statement: 'AI efficiency improved 40%.',
      entities: ['AI'],
      corroboration: 1,
      confidence: 'high',
      provenance: [
        { sourceDocId: 'doc-1', sourceDomain: 'reuters.com', url: 'https://reuters.com/article' },
      ],
      extractedBy: {
        provider: 'ollama',
        model: 'llama3.2',
        status: 'generated',
        generatedAt: '2026-06-11T05:30:00.000Z',
      },
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        contractRevision: 3,
        data: {
          itemsByTopic: {},
          clustersByTopic: {},
          coverageByTopic: {},
          documentsByTopic: { ai: [doc] },
          factsByCluster: { 'cluster-ai-1': [fact] },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses without documentsByTopic/factsByCluster (rev 2 producer, backward-compat)', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact({ contractRevision: 2 }));
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — RankingArtifactSchema optional fields
// ---------------------------------------------------------------------------

describe('RankingArtifactSchema — rev 3 additive fields', () => {
  const baseScore = {
    interaction: 0.8,
    credibility: 0.9,
    corroboration: 0.75,
    recency: 0.7,
    diversity: 0.85,
    total: 0.8,
    weights: {},
  };
  const baseCluster = {
    clusterId: 'c-1',
    topic: 'ai',
    topicLabel: 'AI',
    headline: 'AI news',
    rank: 1,
    score: baseScore,
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

  it('parses a RankedCluster with rev 3 optional fields (technicalSignificance, references, sourceDocIds, gateStatus)', () => {
    const cluster = {
      ...baseCluster,
      score: { ...baseScore, technicalSignificance: 0.85 },
      references: [
        {
          source: 'Reuters',
          sourceDomain: 'reuters.com',
          tier: 'news',
          url: 'https://reuters.com/article',
          title: 'AI news',
          publishedAt: '2026-06-11T04:00:00.000Z',
        },
      ],
      sourceDocIds: ['doc-1'],
      gateStatus: 'auto',
    };
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        contractRevision: 3,
        data: {
          rankedByTopic: { ai: [cluster] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a RankedCluster without rev 3 fields (rev 2 backward-compat)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [baseCluster] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid gateStatus value', () => {
    const cluster = { ...baseCluster, gateStatus: 'approved' };
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: { rankedByTopic: { ai: [cluster] }, audit: [], weightProfile: 'balanced@v1' },
      }),
    );
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — Top10ArtifactSchema sourceDocIds
// ---------------------------------------------------------------------------

describe('Top10ArtifactSchema — rev 3 sourceDocIds field', () => {
  const baseScore = {
    interaction: 0.8,
    credibility: 0.9,
    corroboration: 0.75,
    recency: 0.7,
    diversity: 0.85,
    total: 0.8,
    weights: {},
  };
  const entry = {
    rank: 1,
    clusterId: 'c-1',
    topic: 'ai',
    topicLabel: 'AI',
    headline: 'AI news',
    score: baseScore,
    sourceQuality: 'corroborated',
    confidence: 'high',
    references: [],
    delta: { previousRank: null, movement: 'new' },
    carriedOver: false,
  };

  it('parses a Top10Entry with sourceDocIds (rev 3)', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        contractRevision: 3,
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: ['ai'],
          top10ByTopic: { ai: [{ ...entry, sourceDocIds: ['doc-1', 'doc-2'] }] },
          global: [],
          stability: { carriedOver: 0, fresh: 1, churnRate: 1.0 },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a Top10Entry without sourceDocIds (rev 2 backward-compat)', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: ['ai'],
          top10ByTopic: { ai: [entry] },
          global: [],
          stability: { carriedOver: 0, fresh: 1, churnRate: 1.0 },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — MediaProvenanceSchema
// ---------------------------------------------------------------------------

describe('MediaProvenanceSchema', () => {
  it('parses generated origin without license', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'generated' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses openly-licensed origin with license', () => {
    const result = MediaProvenanceSchema.safeParse({
      origin: 'openly-licensed',
      license: 'CC0',
      creator: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photo-1',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid origin', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'scraped' });
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — ArticleBlock schemas (individual + union)
// ---------------------------------------------------------------------------

describe('TextBlockSchema', () => {
  it('parses a paragraph block', () => {
    const result = TextBlockSchema.safeParse({ type: 'paragraph', text: 'Hello world.' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a list block', () => {
    const result = TextBlockSchema.safeParse({ type: 'list', items: ['Item 1', 'Item 2'] });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects chart type (not a text block)', () => {
    const result = TextBlockSchema.safeParse({ type: 'chart' });
    assert.ok(!result.success);
  });
});

describe('ChartBlockSchema', () => {
  const validChart = {
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

  it('parses a valid chart block', () => {
    const result = ChartBlockSchema.safeParse(validChart);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses with optional caption', () => {
    const result = ChartBlockSchema.safeParse({ ...validChart, caption: 'Efficiency over time.' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid chartType', () => {
    const result = ChartBlockSchema.safeParse({ ...validChart, chartType: 'donut' });
    assert.ok(!result.success);
  });

  it('rejects missing factIds', () => {
    const { factIds: _dropped, ...noFactIds } = validChart;
    const result = ChartBlockSchema.safeParse(noFactIds);
    assert.ok(!result.success);
  });
});

describe('ImageBlockSchema', () => {
  it('parses a valid image block', () => {
    const result = ImageBlockSchema.safeParse({
      type: 'image',
      src: 'https://example.com/img.jpg',
      alt: 'A diagram',
      media: { origin: 'openly-licensed', license: 'CC0' },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects missing media', () => {
    const result = ImageBlockSchema.safeParse({
      type: 'image',
      src: 'https://example.com/img.jpg',
      alt: 'Missing media',
    });
    assert.ok(!result.success);
  });
});

describe('GifBlockSchema', () => {
  it('parses a valid gif block with optional poster', () => {
    const result = GifBlockSchema.safeParse({
      type: 'gif',
      src: 'https://example.com/anim.gif',
      alt: 'Animation',
      poster: 'https://example.com/poster.jpg',
      media: { origin: 'generated' },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('EmbedBlockSchema', () => {
  it('parses a valid embed block', () => {
    const result = EmbedBlockSchema.safeParse({
      type: 'embed',
      provider: 'youtube',
      url: 'https://youtube.com/watch?v=abc',
      title: 'Demo',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('ArticleBlockSchema — union + forward-compat', () => {
  it('accepts a text block', () => {
    const result = ArticleBlockSchema.safeParse({ type: 'heading', text: 'Section' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts a chart block', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'chart',
      chartType: 'line',
      title: 'Trend',
      series: [{ label: 'Q1', value: 10 }],
      factIds: ['f-1'],
      attribution: { sources: [] },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts an image block', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'image',
      src: 'https://ex.com/img.jpg',
      alt: 'Alt',
      media: { origin: 'generated' },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts a gif block', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'gif',
      src: 'https://ex.com/a.gif',
      alt: 'Alt',
      media: { origin: 'generated' },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts an embed block', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'embed',
      provider: 'vimeo',
      url: 'https://vimeo.com/123',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts an unknown future block type (forward-compat, never throw)', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'future-video-block',
      src: 'https://ex.com/v.mp4',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — ClaimProvenanceSchema
// ---------------------------------------------------------------------------

describe('ClaimProvenanceSchema', () => {
  it('parses a valid ClaimProvenance', () => {
    const result = ClaimProvenanceSchema.safeParse({
      blockIndex: 2,
      text: 'AI model efficiency improved by 40% year-over-year.',
      isEditorial: false,
      factIds: ['fact-1', 'fact-2'],
      corroboration: 2,
      confidence: 'high',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses an editorial claim (factIds can be empty for editorial)', () => {
    const result = ClaimProvenanceSchema.safeParse({
      blockIndex: 0,
      text: 'But the story does not end there.',
      isEditorial: true,
      factIds: [],
      corroboration: 0,
      confidence: 'low',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects negative blockIndex', () => {
    const result = ClaimProvenanceSchema.safeParse({
      blockIndex: -1,
      text: 'Claim.',
      isEditorial: false,
      factIds: ['f-1'],
      corroboration: 1,
      confidence: 'high',
    });
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Rev 3 — ArticleArtifactSchema with new fields
// ---------------------------------------------------------------------------

describe('ArticleArtifactSchema — rev 3 additive fields', () => {
  it('parses a SynthesizedArticle with editorialStatus, facts, and claims', () => {
    const article = {
      id: 'article-1',
      rank: 1,
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI Progress: What 2026 Brings',
      dek: 'An independent look.',
      body: [
        { type: 'heading', text: 'Introduction' },
        { type: 'paragraph', text: 'AI has seen remarkable progress.' },
        {
          type: 'chart',
          chartType: 'bar',
          title: 'Efficiency gains',
          series: [
            { label: '2025', value: 30, unit: '%' },
            { label: '2026', value: 40, unit: '%' },
          ],
          factIds: ['fact-1'],
          attribution: { sources: [{ source: 'Reuters', url: 'https://reuters.com/article' }] },
        },
      ],
      keyPoints: ['Efficiency gains'],
      whyItMatters: 'Advances affect developer productivity.',
      readerAction: 'Review the linked papers.',
      tags: ['ai', '2026'],
      confidence: 'high',
      sourceQuality: 'corroborated',
      references: [],
      provenance: {
        clusterId: 'c-1',
        sourceCount: 3,
        distinctDomains: 3,
        upstreamRunId: 'run-top10-1',
      },
      ai: {
        provider: 'ollama',
        model: 'llama3.2',
        status: 'generated',
        generatedAt: '2026-06-11T06:04:00.000Z',
      },
      legalNote: 'Original text only.',
      wordCount: 320,
      readingTimeMinutes: 2,
      generatedAt: '2026-06-11T06:04:00.000Z',
      editorialStatus: 'published',
      facts: [
        {
          id: 'fact-1',
          topic: 'ai',
          clusterId: 'c-1',
          statement: 'AI efficiency improved 40%.',
          entities: ['AI'],
          corroboration: 2,
          confidence: 'high',
          provenance: [
            {
              sourceDocId: 'doc-1',
              sourceDomain: 'reuters.com',
              url: 'https://reuters.com/article',
            },
          ],
          extractedBy: {
            provider: 'ollama',
            model: 'llama3.2',
            status: 'generated',
            generatedAt: '2026-06-11T05:30:00.000Z',
          },
        },
      ],
      claims: [
        {
          blockIndex: 1,
          text: 'AI has seen remarkable progress.',
          isEditorial: false,
          factIds: ['fact-1'],
          corroboration: 2,
          confidence: 'high',
        },
      ],
    };
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        contractRevision: 3,
        data: {
          articles: [article],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: false,
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('parses a held article (editorialStatus: held)', () => {
    const article = {
      id: 'art-held',
      rank: 2,
      topic: 'security',
      topicLabel: 'Security',
      headline: 'New vulnerability',
      dek: 'Details pending verification.',
      body: [{ type: 'paragraph', text: 'Placeholder.' }],
      keyPoints: [],
      whyItMatters: 'TBD.',
      readerAction: 'Check back soon.',
      tags: ['security'],
      confidence: 'low',
      sourceQuality: 'single source',
      references: [],
      provenance: { clusterId: 'c-2', sourceCount: 1, distinctDomains: 1, upstreamRunId: 'run-1' },
      ai: {
        provider: 'deterministic',
        model: 'deterministic@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:00:00.000Z',
      },
      legalNote: 'Original text only.',
      wordCount: 50,
      readingTimeMinutes: 1,
      generatedAt: '2026-06-11T06:00:00.000Z',
      editorialStatus: 'held',
    };
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        contractRevision: 3,
        data: {
          articles: [article],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: false,
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('rejects invalid editorialStatus value', () => {
    const article = {
      id: 'art-1',
      rank: 1,
      topic: 'ai',
      topicLabel: 'AI',
      headline: 'AI',
      dek: 'AI.',
      body: [],
      keyPoints: [],
      whyItMatters: '',
      readerAction: '',
      tags: [],
      confidence: 'high',
      sourceQuality: 'corroborated',
      references: [],
      provenance: { clusterId: 'c-1', sourceCount: 1, distinctDomains: 1, upstreamRunId: 'r-1' },
      ai: {
        provider: 'deterministic',
        model: 'd@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:00:00.000Z',
      },
      legalNote: '',
      wordCount: 0,
      readingTimeMinutes: 0,
      generatedAt: '2026-06-11T06:00:00.000Z',
      editorialStatus: 'approved', // invalid
    };
    const result = ArticleArtifactSchema.safeParse(
      makeArticleArtifact({
        data: {
          articles: [article],
          copyrightPolicy: {
            originalTextOnly: true,
            maxQuoteWords: 25,
            reproduceArticleBody: false,
            requireAttribution: true,
            requireCanonicalLinks: true,
          },
        },
      }),
    );
    assert.ok(!result.success);
  });
});

// ---------------------------------------------------------------------------
// Tier-2 NaN and garbage-input rejection — scoreBreakdown
// ---------------------------------------------------------------------------

describe('Tier-2 NaN rejection — scoreBreakdown / RankingArtifactSchema', () => {
  const baseScore = {
    interaction: 0.8,
    credibility: 0.9,
    corroboration: 0.75,
    recency: 0.7,
    diversity: 0.85,
    total: 0.8,
    weights: {},
  };
  const baseCluster = {
    clusterId: 'c-1',
    topic: 'ai',
    topicLabel: 'AI',
    headline: 'headline',
    rank: 1,
    score: baseScore,
    sourceQuality: 'corroborated',
    confidence: 'high',
    verification: 'multi-source',
    sourceCount: 3,
    distinctDomains: 3,
    tierHistogram: {},
    memberIds: ['i-1'],
    earliestPublishedAt: '2026-06-11T03:00:00.000Z',
    latestPublishedAt: '2026-06-11T05:00:00.000Z',
    auditId: 'audit-1',
  };

  it('rejects NaN in score.total (the core ranking NaN bug)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [{ ...baseCluster, score: { ...baseScore, total: NaN } }] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'NaN total should be rejected');
  });

  it('rejects null in score.total (JSON-serialised NaN → null)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [{ ...baseCluster, score: { ...baseScore, total: null } }] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'null total (JSON-serialised NaN) should be rejected');
  });

  it('rejects NaN in score.interaction', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [{ ...baseCluster, score: { ...baseScore, interaction: NaN } }] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'NaN interaction should be rejected');
  });

  it('rejects NaN in score.credibility', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [{ ...baseCluster, score: { ...baseScore, credibility: NaN } }] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'NaN credibility should be rejected');
  });

  it('rejects Infinity in score.total (overflow guard)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [{ ...baseCluster, score: { ...baseScore, total: Infinity } }] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'Infinity total should be rejected');
  });

  it('accepts a valid score with all finite numbers', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: { ai: [baseCluster] },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// Tier-2 NaN rejection — ExtractedFactSchema (corroboration)
// ---------------------------------------------------------------------------

describe('ExtractedFactSchema — NaN corroboration rejection', () => {
  const validProvenance = {
    sourceDocId: 'doc-1',
    sourceDomain: 'reuters.com',
    url: 'https://reuters.com/article',
  };

  it('rejects NaN corroboration', () => {
    const result = ExtractedFactSchema.safeParse({
      id: 'fact-1',
      topic: 'ai',
      clusterId: 'c-1',
      statement: 'AI improved.',
      entities: [],
      provenance: [validProvenance],
      corroboration: NaN,
      confidence: 'high',
      extractedBy: {
        provider: 'deterministic',
        model: 'd@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:00:00.000Z',
      },
    });
    assert.ok(!result.success, 'NaN corroboration should be rejected');
  });

  it('rejects corroboration = 0 (must be >= 1)', () => {
    const result = ExtractedFactSchema.safeParse({
      id: 'fact-1',
      topic: 'ai',
      clusterId: 'c-1',
      statement: 'AI improved.',
      entities: [],
      provenance: [validProvenance],
      corroboration: 0,
      confidence: 'high',
      extractedBy: {
        provider: 'deterministic',
        model: 'd@v1',
        status: 'fallback',
        generatedAt: '2026-06-11T06:00:00.000Z',
      },
    });
    assert.ok(!result.success, 'corroboration=0 should be rejected (min 1)');
  });
});

// ---------------------------------------------------------------------------
// parseArtifact + per-stage helpers
// ---------------------------------------------------------------------------

describe('parseArtifact generic helper', () => {
  it('returns parsed artifact on valid aggregation input', () => {
    const raw = makeAggArtifact();
    const result = parseArtifact(raw, 'aggregation', AggregationArtifactSchema);
    assert.strictEqual(result.artifact, 'aggregation');
    assert.strictEqual(result.schemaVersion, SCHEMA_VERSION);
  });

  it('throws SchemaVersionError on malformed envelope (wrong schemaVersion)', () => {
    const raw = makeAggArtifact({ schemaVersion: 'ardur-content-pipeline/v2' });
    assert.throws(
      () => parseArtifact(raw, 'aggregation', AggregationArtifactSchema),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on valid envelope but structurally malformed data (not SchemaVersionError)', () => {
    const raw = makeAggArtifact({ data: { itemsByTopic: 'not-an-object' } });
    let threw = false;
    try {
      parseArtifact(raw, 'aggregation', AggregationArtifactSchema);
    } catch (err) {
      threw = true;
      assert.ok(
        !(err instanceof SchemaVersionError),
        'should throw ZodError, not SchemaVersionError',
      );
    }
    assert.ok(threw, 'should have thrown');
  });
});

describe('per-stage convenience parsers', () => {
  it('parseAggregationArtifact returns a valid aggregation artifact', () => {
    const result = parseAggregationArtifact(makeAggArtifact());
    assert.strictEqual(result.artifact, 'aggregation');
  });

  it('parseRankingArtifact returns a valid ranking artifact', () => {
    const result = parseRankingArtifact(makeRankingArtifact());
    assert.strictEqual(result.artifact, 'ranking');
  });

  it('parseTop10Artifact returns a valid top10 artifact', () => {
    const result = parseTop10Artifact(makeTop10Artifact());
    assert.strictEqual(result.artifact, 'top10');
  });

  it('parseArticleArtifact returns a valid article artifact', () => {
    const result = parseArticleArtifact(makeArticleArtifact());
    assert.strictEqual(result.artifact, 'articles');
  });

  it('parseAggregationArtifact throws SchemaVersionError on wrong stage', () => {
    assert.throws(
      () => parseAggregationArtifact(makeRankingArtifact()),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('parseRankingArtifact throws on NaN score.total (Zod layer)', () => {
    const badScore = {
      interaction: 0.8,
      credibility: 0.9,
      corroboration: 0.75,
      recency: 0.7,
      diversity: 0.85,
      total: NaN,
      weights: {},
    };
    const raw = makeRankingArtifact({
      data: {
        rankedByTopic: {
          ai: [
            {
              clusterId: 'c-1',
              topic: 'ai',
              topicLabel: 'AI',
              headline: 'h',
              rank: 1,
              score: badScore,
              sourceQuality: 'corroborated',
              confidence: 'high',
              verification: 'multi-source',
              sourceCount: 1,
              distinctDomains: 1,
              tierHistogram: {},
              memberIds: [],
              earliestPublishedAt: '2026-06-11T03:00:00.000Z',
              latestPublishedAt: '2026-06-11T05:00:00.000Z',
              auditId: 'a-1',
            },
          ],
        },
        audit: [],
        weightProfile: 'balanced@v1',
      },
    });
    assert.throws(() => parseRankingArtifact(raw), 'NaN score.total must throw');
  });
});

// ---------------------------------------------------------------------------
// QA #3 — consistent .finite() on every plain z.number() field
// ---------------------------------------------------------------------------

describe('interactionMetrics — NaN/Infinity rejection on nullable numeric fields', () => {
  const validItem = {
    id: 'item-1',
    topic: 'ai',
    topicLabel: 'AI',
    title: 'Title',
    source: 'Reuters',
    sourceDomain: 'reuters.com',
    sourceUrl: 'https://reuters.com',
    url: 'https://reuters.com/a',
    tier: 'news',
    publishedAt: '2026-06-11T04:00:00.000Z',
    summaryHint: 'Hint',
    interaction: {
      feedRank: 0,
      shares: null,
      comments: null,
      reactions: null,
      crossSourceMentions: 3,
      velocity: 1.5,
      capturedAt: '2026-06-11T05:00:00.000Z',
      provenance: 'rss-position',
    },
    clusterId: 'c-1',
    fingerprint: 'fp-1',
  };
  const makeAgg = (interaction: Record<string, unknown>) =>
    makeAggArtifact({
      data: {
        itemsByTopic: { ai: [{ ...validItem, interaction }] },
        clustersByTopic: {},
        coverageByTopic: {},
      },
    });

  it('rejects NaN in feedRank', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, feedRank: NaN }),
    );
    assert.ok(!result.success, 'NaN feedRank should be rejected');
  });

  it('rejects NaN in shares', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, shares: NaN }),
    );
    assert.ok(!result.success, 'NaN shares should be rejected');
  });

  it('rejects NaN in velocity', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, velocity: NaN }),
    );
    assert.ok(!result.success, 'NaN velocity should be rejected');
  });

  it('rejects Infinity in velocity', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, velocity: Infinity }),
    );
    assert.ok(!result.success, 'Infinity velocity should be rejected');
  });

  it('rejects NaN in crossSourceMentions (int field)', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, crossSourceMentions: NaN }),
    );
    assert.ok(!result.success, 'NaN crossSourceMentions should be rejected');
  });

  it('rejects negative crossSourceMentions', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validItem.interaction, crossSourceMentions: -1 }),
    );
    assert.ok(!result.success, 'Negative crossSourceMentions should be rejected');
  });

  it('accepts valid interaction metrics (null-able fields as null)', () => {
    const result = AggregationArtifactSchema.safeParse(makeAgg(validItem.interaction));
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('sourceCoverage — count field NaN rejection', () => {
  const validCoverage = {
    sourcesConfigured: 20,
    sourcesQueried: 18,
    sourcesResponded: 15,
    distinctDomains: 12,
    degraded: false,
  };
  const makeAgg = (coverage: Record<string, unknown>) =>
    makeAggArtifact({
      data: {
        itemsByTopic: {},
        clustersByTopic: {},
        coverageByTopic: { ai: coverage },
      },
    });

  it('rejects NaN in sourcesResponded', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validCoverage, sourcesResponded: NaN }),
    );
    assert.ok(!result.success, 'NaN sourcesResponded should be rejected');
  });

  it('rejects negative distinctDomains', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAgg({ ...validCoverage, distinctDomains: -1 }),
    );
    assert.ok(!result.success, 'Negative distinctDomains should be rejected');
  });

  it('accepts valid coverage', () => {
    const result = AggregationArtifactSchema.safeParse(makeAgg(validCoverage));
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('ExtractedFactSchema — quantity.value NaN rejection', () => {
  const validProvenance = {
    sourceDocId: 'doc-1',
    sourceDomain: 'reuters.com',
    url: 'https://reuters.com/article',
  };
  const baseFact = {
    id: 'fact-1',
    topic: 'ai',
    clusterId: 'c-1',
    statement: 'AI improved.',
    entities: [],
    provenance: [validProvenance],
    corroboration: 1,
    confidence: 'high',
    extractedBy: {
      provider: 'deterministic',
      model: 'd@v1',
      status: 'fallback',
      generatedAt: '2026-06-11T06:00:00.000Z',
    },
  };

  it('rejects NaN in quantity.value', () => {
    const result = ExtractedFactSchema.safeParse({
      ...baseFact,
      quantity: { metric: 'efficiency', value: NaN },
    });
    assert.ok(!result.success, 'NaN quantity.value should be rejected');
  });

  it('rejects Infinity in quantity.value', () => {
    const result = ExtractedFactSchema.safeParse({
      ...baseFact,
      quantity: { metric: 'efficiency', value: Infinity },
    });
    assert.ok(!result.success, 'Infinity quantity.value should be rejected');
  });

  it('accepts a valid finite quantity value', () => {
    const result = ExtractedFactSchema.safeParse({
      ...baseFact,
      quantity: { metric: 'efficiency', value: 40 },
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('auditEntry — inputs/weights NaN rejection', () => {
  const makeRanking = (
    auditInputs: Record<string, unknown>,
    auditWeights: Record<string, unknown>,
  ) =>
    makeRankingArtifact({
      data: {
        rankedByTopic: {},
        audit: [
          {
            auditId: 'a-1',
            clusterId: 'c-1',
            topic: 'ai',
            inputs: auditInputs,
            weights: auditWeights,
            computed: {
              interaction: 0.8,
              credibility: 0.9,
              corroboration: 0.75,
              recency: 0.7,
              diversity: 0.85,
              total: 0.8,
              weights: {},
            },
            rationale: 'test',
            weightProfile: 'balanced@v1',
            rankedAt: '2026-06-11T06:00:00.000Z',
          },
        ],
        weightProfile: 'balanced@v1',
      },
    });

  it('rejects NaN in auditEntry.inputs value', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRanking({ signal_a: NaN }, { signal_a: 0.2 }),
    );
    assert.ok(!result.success, 'NaN audit input value should be rejected');
  });

  it('rejects NaN in auditEntry.weights value', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRanking({ signal_a: 0.8 }, { signal_a: NaN }),
    );
    assert.ok(!result.success, 'NaN audit weight value should be rejected');
  });

  it('accepts valid finite inputs and weights', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRanking({ signal_a: 0.8 }, { signal_a: 0.2 }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('stabilityReport — NaN/Infinity rejection', () => {
  const makeTop10 = (stability: Record<string, unknown>) =>
    makeTop10Artifact({
      data: {
        nextRefreshAt: '2026-06-11T12:00:00.000Z',
        topicsCovered: [],
        top10ByTopic: {},
        global: [],
        stability,
      },
    });

  it('rejects NaN in churnRate', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10({ carriedOver: 0, fresh: 0, churnRate: NaN }),
    );
    assert.ok(!result.success, 'NaN churnRate should be rejected');
  });

  it('rejects NaN in carriedOver', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10({ carriedOver: NaN, fresh: 0, churnRate: 0 }),
    );
    assert.ok(!result.success, 'NaN carriedOver should be rejected');
  });

  it('rejects negative carriedOver', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10({ carriedOver: -1, fresh: 0, churnRate: 0 }),
    );
    assert.ok(!result.success, 'Negative carriedOver should be rejected');
  });

  it('accepts valid stability report', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10({ carriedOver: 5, fresh: 5, churnRate: 0.5 }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('ChartBlockSchema — series value NaN/Infinity rejection', () => {
  const validChart = {
    type: 'chart',
    chartType: 'bar',
    title: 'Efficiency',
    series: [{ label: '2025', value: 30, unit: '%' }],
    factIds: ['fact-1'],
    attribution: { sources: [{ source: 'Reuters', url: 'https://reuters.com/a' }] },
  };

  it('rejects NaN in series value', () => {
    const result = ChartBlockSchema.safeParse({
      ...validChart,
      series: [{ label: '2025', value: NaN }],
    });
    assert.ok(!result.success, 'NaN series value should be rejected');
  });

  it('rejects Infinity in series value', () => {
    const result = ChartBlockSchema.safeParse({
      ...validChart,
      series: [{ label: '2025', value: Infinity }],
    });
    assert.ok(!result.success, 'Infinity series value should be rejected');
  });

  it('accepts valid finite series value', () => {
    const result = ChartBlockSchema.safeParse(validChart);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// QA #3 — reserved-key filter on z.record fields (__proto__ / constructor)
// ---------------------------------------------------------------------------

describe('reserved-key rejection — aggregation topic maps', () => {
  it('rejects __proto__ as a topic key in itemsByTopic (via JSON.parse)', () => {
    // Object literal { __proto__: [] } sets the prototype, not an own property — use
    // JSON.parse to produce an object where __proto__ IS an own enumerable key, which
    // is how it arrives from an attacker-crafted JSON payload.
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: {
          itemsByTopic: JSON.parse('{"__proto__":[]}') as Record<string, unknown>,
          clustersByTopic: {},
          coverageByTopic: {},
        },
      }),
    );
    assert.ok(!result.success, '__proto__ topic key should be rejected');
  });

  it('rejects constructor as a topic key in clustersByTopic', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: {
          itemsByTopic: {},
          clustersByTopic: { constructor: [] },
          coverageByTopic: {},
        },
      }),
    );
    assert.ok(!result.success, 'constructor topic key should be rejected');
  });

  it('rejects prototype as a topic key in coverageByTopic', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: {
          itemsByTopic: {},
          clustersByTopic: {},
          coverageByTopic: {
            prototype: {
              sourcesConfigured: 20,
              sourcesQueried: 18,
              sourcesResponded: 15,
              distinctDomains: 12,
              degraded: false,
            },
          },
        },
      }),
    );
    assert.ok(!result.success, 'prototype topic key should be rejected');
  });

  it('accepts a normal topic key (ai, security, etc.)', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('reserved-key rejection — ranking rankedByTopic', () => {
  it('rejects __proto__ as a topic key in rankedByTopic (via JSON.parse)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: JSON.parse('{"__proto__":[]}') as Record<string, unknown>,
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, '__proto__ rankedByTopic key should be rejected');
  });

  it('rejects __proto__ as a key in auditEntry.inputs (via JSON.parse)', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: {},
          audit: [
            {
              auditId: 'a-1',
              clusterId: 'c-1',
              topic: 'ai',
              inputs: JSON.parse('{"__proto__":0.8}') as Record<string, unknown>,
              weights: { signal: 0.2 },
              computed: {
                interaction: 0.8,
                credibility: 0.9,
                corroboration: 0.75,
                recency: 0.7,
                diversity: 0.85,
                total: 0.8,
                weights: {},
              },
              rationale: 'test',
              weightProfile: 'balanced@v1',
              rankedAt: '2026-06-11T06:00:00.000Z',
            },
          ],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, '__proto__ auditEntry.inputs key should be rejected');
  });

  it('rejects constructor as a key in scoreBreakdown.weights', () => {
    const badScore = {
      interaction: 0.8,
      credibility: 0.9,
      corroboration: 0.75,
      recency: 0.7,
      diversity: 0.85,
      total: 0.8,
      weights: { constructor: 0.2 },
    };
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: {
            ai: [
              {
                clusterId: 'c-1',
                topic: 'ai',
                topicLabel: 'AI',
                headline: 'h',
                rank: 1,
                score: badScore,
                sourceQuality: 'corroborated',
                confidence: 'high',
                verification: 'multi-source',
                sourceCount: 1,
                distinctDomains: 1,
                tierHistogram: {},
                memberIds: [],
                earliestPublishedAt: '2026-06-11T03:00:00.000Z',
                latestPublishedAt: '2026-06-11T05:00:00.000Z',
                auditId: 'a-1',
              },
            ],
          },
          audit: [],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'constructor weights key should be rejected');
  });
});

describe('reserved-key rejection — top10 top10ByTopic', () => {
  it('rejects __proto__ as a topic key in top10ByTopic (via JSON.parse)', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: [],
          top10ByTopic: JSON.parse('{"__proto__":[]}') as Record<string, unknown>,
          global: [],
          stability: { carriedOver: 0, fresh: 0, churnRate: 0 },
        },
      }),
    );
    assert.ok(!result.success, '__proto__ top10ByTopic key should be rejected');
  });

  it('rejects constructor as a topic key in top10ByTopic', () => {
    const result = Top10ArtifactSchema.safeParse(
      makeTop10Artifact({
        data: {
          nextRefreshAt: '2026-06-11T12:00:00.000Z',
          topicsCovered: [],
          top10ByTopic: { constructor: [] },
          global: [],
          stability: { carriedOver: 0, fresh: 0, churnRate: 0 },
        },
      }),
    );
    assert.ok(!result.success, 'constructor top10ByTopic key should be rejected');
  });

  it('accepts normal topic keys (ai, security)', () => {
    const result = Top10ArtifactSchema.safeParse(makeTop10Artifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #4 — forward-compat passthrough on RankingData / Top10Data / ArticleData
// ---------------------------------------------------------------------------

describe('passthrough — RankingData, Top10Data, ArticleData preserve unknown fields', () => {
  it('RankingArtifactSchema preserves unknown data fields', () => {
    const artifact = makeRankingArtifact({
      data: {
        rankedByTopic: {},
        audit: [],
        weightProfile: 'balanced@v1',
        futureRankingField: 'preserved',
      },
    });
    const result = RankingArtifactSchema.safeParse(artifact);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
    assert.strictEqual(
      (result.data?.data as Record<string, unknown>)['futureRankingField'],
      'preserved',
    );
  });

  it('Top10ArtifactSchema preserves unknown data fields', () => {
    const artifact = makeTop10Artifact({
      data: {
        nextRefreshAt: '2026-06-11T12:00:00.000Z',
        topicsCovered: [],
        top10ByTopic: {},
        global: [],
        stability: { carriedOver: 0, fresh: 0, churnRate: 0 },
        futureTop10Field: 'preserved',
      },
    });
    const result = Top10ArtifactSchema.safeParse(artifact);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
    assert.strictEqual(
      (result.data?.data as Record<string, unknown>)['futureTop10Field'],
      'preserved',
    );
  });

  it('ArticleArtifactSchema preserves unknown data fields', () => {
    const artifact = makeArticleArtifact({
      data: {
        articles: [],
        copyrightPolicy: {
          originalTextOnly: true,
          maxQuoteWords: 25,
          reproduceArticleBody: false,
          requireAttribution: true,
          requireCanonicalLinks: true,
        },
        futureArticleField: 'preserved',
      },
    });
    const result = ArticleArtifactSchema.safeParse(artifact);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
    assert.strictEqual(
      (result.data?.data as Record<string, unknown>)['futureArticleField'],
      'preserved',
    );
  });
});

// ---------------------------------------------------------------------------
// #5 — URL scheme validation (javascript:/data: rejected)
// ---------------------------------------------------------------------------

describe('URL scheme validation — unsafe schemes rejected', () => {
  it('rejects javascript: URL in AggregatedItem.url', () => {
    const item = {
      id: 'i-1',
      topic: 'ai',
      topicLabel: 'AI',
      title: 'T',
      source: 'S',
      sourceDomain: 's.com',
      sourceUrl: '',
      url: 'javascript:alert(1)',
      tier: 'news',
      publishedAt: '2026-06-11T04:00:00.000Z',
      summaryHint: 'h',
      interaction: {
        feedRank: 0,
        shares: null,
        comments: null,
        reactions: null,
        crossSourceMentions: 1,
        velocity: null,
        capturedAt: '2026-06-11T05:00:00.000Z',
        provenance: 'rss',
      },
      clusterId: 'c-1',
      fingerprint: 'fp-1',
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: { itemsByTopic: { ai: [item] }, clustersByTopic: {}, coverageByTopic: {} },
      }),
    );
    assert.ok(!result.success, 'javascript: URL should be rejected');
  });

  it('rejects data: URL in AggregatedItem.sourceUrl', () => {
    const item = {
      id: 'i-1',
      topic: 'ai',
      topicLabel: 'AI',
      title: 'T',
      source: 'S',
      sourceDomain: 's.com',
      sourceUrl: 'data:text/html,<script>evil</script>',
      url: 'https://safe.com/article',
      tier: 'news',
      publishedAt: '2026-06-11T04:00:00.000Z',
      summaryHint: 'h',
      interaction: {
        feedRank: 0,
        shares: null,
        comments: null,
        reactions: null,
        crossSourceMentions: 1,
        velocity: null,
        capturedAt: '2026-06-11T05:00:00.000Z',
        provenance: 'rss',
      },
      clusterId: 'c-1',
      fingerprint: 'fp-1',
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: { itemsByTopic: { ai: [item] }, clustersByTopic: {}, coverageByTopic: {} },
      }),
    );
    assert.ok(!result.success, 'data: sourceUrl should be rejected');
  });

  it('rejects javascript: URL in EmbedBlockSchema.url', () => {
    const result = EmbedBlockSchema.safeParse({
      type: 'embed',
      provider: 'yt',
      url: 'javascript:void(0)',
    });
    assert.ok(!result.success, 'javascript: embed URL should be rejected');
  });

  it('rejects javascript: URL in ImageBlockSchema.src', () => {
    const result = ImageBlockSchema.safeParse({
      type: 'image',
      src: 'javascript:1',
      alt: 'x',
      media: { origin: 'generated' },
    });
    assert.ok(!result.success, 'javascript: image src should be rejected');
  });

  it('accepts a normal https URL', () => {
    const result = EmbedBlockSchema.safeParse({
      type: 'embed',
      provider: 'yt',
      url: 'https://youtube.com/watch?v=abc',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts empty sourceUrl (sourceUrl may be "")', () => {
    const item = {
      id: 'i-1',
      topic: 'ai',
      topicLabel: 'AI',
      title: 'T',
      source: 'S',
      sourceDomain: 's.com',
      sourceUrl: '',
      url: 'https://safe.com/article',
      tier: 'news',
      publishedAt: '2026-06-11T04:00:00.000Z',
      summaryHint: 'h',
      interaction: {
        feedRank: 0,
        shares: null,
        comments: null,
        reactions: null,
        crossSourceMentions: 1,
        velocity: null,
        capturedAt: '2026-06-11T05:00:00.000Z',
        provenance: 'rss',
      },
      clusterId: 'c-1',
      fingerprint: 'fp-1',
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: { itemsByTopic: { ai: [item] }, clustersByTopic: {}, coverageByTopic: {} },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #7 — reserved prototype key in passthrough objects
// ---------------------------------------------------------------------------

describe('reserved-key rejection — passthrough objects (not just z.record)', () => {
  it('rejects constructor key in AggregatedItem passthrough fields', () => {
    const item = {
      id: 'i-1',
      topic: 'ai',
      topicLabel: 'AI',
      title: 'T',
      source: 'S',
      sourceDomain: 's.com',
      sourceUrl: '',
      url: 'https://safe.com/a',
      tier: 'news',
      publishedAt: '2026-06-11T04:00:00.000Z',
      summaryHint: 'h',
      interaction: {
        feedRank: 0,
        shares: null,
        comments: null,
        reactions: null,
        crossSourceMentions: 1,
        velocity: null,
        capturedAt: '2026-06-11T05:00:00.000Z',
        provenance: 'rss',
      },
      clusterId: 'c-1',
      fingerprint: 'fp-1',
      constructor: 'evil',
    };
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        data: { itemsByTopic: { ai: [item] }, clustersByTopic: {}, coverageByTopic: {} },
      }),
    );
    assert.ok(!result.success, 'constructor key in passthrough object should be rejected');
  });

  it('rejects constructor key in TextBlockSchema passthrough fields', () => {
    const result = TextBlockSchema.safeParse({
      type: 'paragraph',
      text: 'Hello.',
      constructor: 'evil',
    });
    assert.ok(!result.success, 'constructor key in TextBlock should be rejected');
  });

  it('rejects prototype key in ChartBlockSchema passthrough fields', () => {
    const result = ChartBlockSchema.safeParse({
      type: 'chart',
      chartType: 'bar',
      title: 'T',
      series: [{ label: 'A', value: 1 }],
      factIds: ['f-1'],
      attribution: { sources: [{ source: 'S', url: 'https://safe.com' }] },
      prototype: 'evil',
    });
    assert.ok(!result.success, 'prototype key in ChartBlock should be rejected');
  });
});

// ---------------------------------------------------------------------------
// #8 — ISO datetime validation on date string fields
// ---------------------------------------------------------------------------

describe('ISO datetime validation — garbage timestamps rejected', () => {
  it('rejects garbage generatedAt in envelope', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({ generatedAt: 'not-a-date' }),
    );
    assert.ok(!result.success, 'garbage generatedAt should be rejected');
  });

  it('rejects garbage windowStart in cycle', () => {
    const result = AggregationArtifactSchema.safeParse(
      makeAggArtifact({
        cycle: {
          id: '2026-06-11T06:00:00.000Z',
          windowStart: '20260611',
          windowEnd: '2026-06-11T12:00:00.000Z',
        },
      }),
    );
    assert.ok(!result.success, 'non-ISO windowStart should be rejected');
  });

  it('rejects garbage publishedAt in SourceDocumentSchema', () => {
    const result = SourceDocumentSchema.safeParse({
      id: 'd-1',
      url: 'https://example.com',
      source: 'S',
      sourceDomain: 's.com',
      tier: 'news',
      title: 'T',
      publishedAt: '2026-06-11',
      fetchedAt: '2026-06-11T05:00:00.000Z',
      extraction: 'full',
      accessPolicy: 'allowed',
      wordCount: 100,
      lang: 'en',
      contentHash: 'abc',
    });
    assert.ok(!result.success, 'date-only publishedAt should be rejected (must be full datetime)');
  });

  it('accepts valid ISO 8601 UTC datetime strings', () => {
    const result = AggregationArtifactSchema.safeParse(makeAggArtifact());
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #9 — fact-grounding invariants
// ---------------------------------------------------------------------------

describe('ChartBlock.factIds must be non-empty (#9a)', () => {
  const validChart = {
    type: 'chart',
    chartType: 'bar',
    title: 'T',
    series: [{ label: 'A', value: 1 }],
    attribution: { sources: [{ source: 'S', url: 'https://safe.com' }] },
  };

  it('rejects ChartBlock with empty factIds', () => {
    const result = ChartBlockSchema.safeParse({ ...validChart, factIds: [] });
    assert.ok(!result.success, 'empty factIds should be rejected');
  });

  it('accepts ChartBlock with non-empty factIds', () => {
    const result = ChartBlockSchema.safeParse({ ...validChart, factIds: ['fact-1'] });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('ClaimProvenance non-editorial factIds (#9b)', () => {
  it('rejects non-editorial claim with empty factIds', () => {
    const result = ClaimProvenanceSchema.safeParse({
      blockIndex: 2,
      text: 'AI efficiency improved 40%.',
      isEditorial: false,
      factIds: [],
      corroboration: 0,
      confidence: 'high',
    });
    assert.ok(!result.success, 'non-editorial claim with empty factIds should be rejected');
  });

  it('accepts editorial claim with empty factIds (editorial lines are not fact-gated)', () => {
    const result = ClaimProvenanceSchema.safeParse({
      blockIndex: 0,
      text: 'The story does not end there.',
      isEditorial: true,
      factIds: [],
      corroboration: 0,
      confidence: 'low',
    });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

describe('MediaProvenance openly-licensed requires license (#9c)', () => {
  it('rejects openly-licensed MediaProvenance without license', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'openly-licensed' });
    assert.ok(!result.success, 'openly-licensed without license should be rejected');
  });

  it('rejects openly-licensed MediaProvenance with empty license', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'openly-licensed', license: '   ' });
    assert.ok(!result.success, 'openly-licensed with blank license should be rejected');
  });

  it('accepts generated origin without license', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'generated' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts openly-licensed origin with license', () => {
    const result = MediaProvenanceSchema.safeParse({ origin: 'openly-licensed', license: 'CC0' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #11 — ArticleBlock union catch-all no longer lets malformed known blocks through
// ---------------------------------------------------------------------------

describe('ArticleBlockSchema — malformed known-type blocks are rejected (#11)', () => {
  it('rejects a chart block with invalid chartType (was silently accepted before)', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'chart',
      chartType: 'donut', // not in enum
      title: 'T',
      series: [],
      factIds: ['f-1'],
      attribution: { sources: [] },
    });
    assert.ok(!result.success, 'malformed chart block must not fall through to catch-all');
  });

  it('rejects an image block missing required media field', () => {
    const result = ArticleBlockSchema.safeParse({
      type: 'image',
      src: 'https://example.com/img.jpg',
      alt: 'Alt',
      // media is missing
    });
    assert.ok(!result.success, 'image block without media must be rejected');
  });

  it('still accepts a genuinely unknown future block type', () => {
    const result = ArticleBlockSchema.safeParse({ type: 'future-hologram-block', data: 'xyz' });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #13 — quote word count enforcement
// ---------------------------------------------------------------------------

describe('FactProvenance quote word-count limit (<= 25 words)', () => {
  const base = { sourceDocId: 'doc-1', sourceDomain: 'reuters.com', url: 'https://reuters.com/a' };

  it('rejects a quote exceeding 25 words', () => {
    const longQuote =
      'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five twenty-six';
    const result = FactProvenanceSchema.safeParse({ ...base, quote: longQuote });
    assert.ok(!result.success, 'quote over 25 words should be rejected');
  });

  it('accepts a quote of exactly 25 words', () => {
    const exactly25 =
      'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five';
    const result = FactProvenanceSchema.safeParse({ ...base, quote: exactly25 });
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });

  it('accepts absent quote (optional field)', () => {
    const result = FactProvenanceSchema.safeParse(base);
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

// ---------------------------------------------------------------------------
// #15 — FORBIDDEN_METRIC_KEY_FRAGMENTS enforced in score/audit keys
// ---------------------------------------------------------------------------

describe('FORBIDDEN_METRIC_KEY_FRAGMENTS enforced in metric keys (#15)', () => {
  const baseScore = {
    interaction: 0.8,
    credibility: 0.9,
    corroboration: 0.75,
    recency: 0.7,
    diversity: 0.85,
    total: 0.8,
  };

  it('rejects PII fragment "email" in scoreBreakdown.weights key', () => {
    // Trigger through auditEntry.weights (cleaner path)
    const result2 = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: {},
          audit: [
            {
              auditId: 'a-1',
              clusterId: 'c-1',
              topic: 'ai',
              inputs: { normal_signal: 0.8 },
              weights: { email_score: 0.1 }, // forbidden PII fragment
              computed: { ...baseScore, weights: {} },
              rationale: 'test',
              weightProfile: 'balanced@v1',
              rankedAt: '2026-06-11T06:00:00.000Z',
            },
          ],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result2.success, 'PII fragment "email" in weights key should be rejected');
  });

  it('rejects PII fragment "session" in auditEntry.inputs key', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: {},
          audit: [
            {
              auditId: 'a-1',
              clusterId: 'c-1',
              topic: 'ai',
              inputs: { session_clicks: 0.5 }, // forbidden PII fragment
              weights: { interaction: 0.2 },
              computed: { ...baseScore, weights: {} },
              rationale: 'test',
              weightProfile: 'balanced@v1',
              rankedAt: '2026-06-11T06:00:00.000Z',
            },
          ],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(!result.success, 'PII fragment "session" in inputs key should be rejected');
  });

  it('accepts safe metric key names', () => {
    const result = RankingArtifactSchema.safeParse(
      makeRankingArtifact({
        data: {
          rankedByTopic: {},
          audit: [
            {
              auditId: 'a-1',
              clusterId: 'c-1',
              topic: 'ai',
              inputs: { cross_source_mentions: 3 },
              weights: { credibility_score: 0.3 },
              computed: { ...baseScore, weights: {} },
              rationale: 'test',
              weightProfile: 'balanced@v1',
              rankedAt: '2026-06-11T06:00:00.000Z',
            },
          ],
          weightProfile: 'balanced@v1',
        },
      }),
    );
    assert.ok(result.success, JSON.stringify((result as { error?: unknown }).error));
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AggregationArtifactSchema,
  RankingArtifactSchema,
  Top10ArtifactSchema,
  ArticleArtifactSchema,
} from './zod.ts';
import { SCHEMA_VERSION } from './index.ts';

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

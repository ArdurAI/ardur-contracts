/**
 * @ardurai/contracts/zod — Tier-2 structural Zod schemas.
 *
 * Requires the `zod` peer dependency (^3).
 * Import via the subpath so Tier-1-only consumers pull no zod dep:
 *
 *   import { AggregationArtifactSchema } from '@ardurai/contracts/zod';
 *
 * All schemas use .passthrough() on the envelope level to remain forward-compatible
 * with additive revisions — unknown fields are preserved, not stripped.
 */

import { z } from 'zod';
import { SCHEMA_VERSION } from './index.ts';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const sourceTier = z.enum(['primary', 'paper', 'news', 'technical-news', 'security-news']);

const confidence = z.enum(['high', 'medium', 'low']);

const sourceQuality = z.enum([
  'corroborated',
  'multi-source',
  'single trusted source',
  'single source',
]);

const verification = z.enum(['multi-source', 'single-source']);

const providerMeta = z.object({
  provider: z.enum(['deterministic', 'ollama', 'openai']),
  model: z.string(),
  status: z.enum(['generated', 'fallback']),
  reason: z.string().optional(),
  generatedAt: z.string(),
});

const cycleMeta = z.object({
  id: z.string(),
  windowStart: z.string(),
  windowEnd: z.string(),
});

const topicMeta = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
});

// ---------------------------------------------------------------------------
// Envelope wrapper factory
// ---------------------------------------------------------------------------

function makeEnvelopeSchema<TStage extends string, TData extends z.ZodTypeAny>(
  artifactLiteral: TStage,
  dataSchema: TData,
) {
  return z
    .object({
      schemaVersion: z.literal(SCHEMA_VERSION),
      contractRevision: z.number().int().positive().optional(),
      artifact: z.literal(artifactLiteral),
      runId: z.string(),
      upstreamRunId: z.string().nullable(),
      generatedAt: z.string(),
      cycle: cycleMeta,
      topics: z.array(topicMeta),
      provider: providerMeta.optional(),
      warnings: z.array(z.string()),
      data: dataSchema,
    })
    .passthrough();
}

// ---------------------------------------------------------------------------
// Stage 1 — AggregationArtifact
// ---------------------------------------------------------------------------

const interactionMetrics = z.object({
  feedRank: z.number().nullable(),
  shares: z.number().nullable(),
  comments: z.number().nullable(),
  reactions: z.number().nullable(),
  crossSourceMentions: z.number(),
  velocity: z.number().nullable(),
  capturedAt: z.string(),
  provenance: z.string(),
});

const aggregatedItem = z
  .object({
    id: z.string(),
    topic: z.string(),
    topicLabel: z.string(),
    title: z.string(),
    source: z.string(),
    sourceDomain: z.string(),
    sourceUrl: z.string(),
    url: z.string(),
    tier: sourceTier,
    publishedAt: z.string(),
    summaryHint: z.string(),
    interaction: interactionMetrics,
    clusterId: z.string(),
    fingerprint: z.string(),
    claims: z.array(z.string()).optional(), // rev 2 additive field
  })
  .passthrough();

const cluster = z
  .object({
    clusterId: z.string(),
    topic: z.string(),
    topicLabel: z.string(),
    headline: z.string(),
    memberIds: z.array(z.string()),
    sourceCount: z.number(),
    distinctDomains: z.number(),
    tierHistogram: z
      .object({
        primary: z.number().optional(),
        paper: z.number().optional(),
        news: z.number().optional(),
        'technical-news': z.number().optional(),
        'security-news': z.number().optional(),
      })
      .passthrough(),
    earliestPublishedAt: z.string(),
    latestPublishedAt: z.string(),
  })
  .passthrough();

const sourceCoverage = z.object({
  sourcesConfigured: z.number(),
  sourcesQueried: z.number(),
  sourcesResponded: z.number(),
  distinctDomains: z.number(),
  degraded: z.boolean(),
});

const aggregationData = z.object({
  itemsByTopic: z.record(z.string(), z.array(aggregatedItem)),
  clustersByTopic: z.record(z.string(), z.array(cluster)),
  coverageByTopic: z.record(z.string(), sourceCoverage),
});

export const AggregationArtifactSchema = makeEnvelopeSchema('aggregation', aggregationData);
export type AggregationArtifactInput = z.input<typeof AggregationArtifactSchema>;

// ---------------------------------------------------------------------------
// Stage 2 — RankingArtifact
// ---------------------------------------------------------------------------

const scoreBreakdown = z.object({
  interaction: z.number(),
  credibility: z.number(),
  recency: z.number(),
  diversity: z.number(),
  corroboration: z.number(),
  total: z.number(),
  weights: z.record(z.string(), z.number()),
});

const tierHistogram = z
  .object({
    primary: z.number().optional(),
    paper: z.number().optional(),
    news: z.number().optional(),
    'technical-news': z.number().optional(),
    'security-news': z.number().optional(),
  })
  .passthrough();

const rankedCluster = z
  .object({
    clusterId: z.string(),
    topic: z.string(),
    topicLabel: z.string(),
    headline: z.string(),
    rank: z.number(),
    score: scoreBreakdown,
    sourceQuality,
    confidence,
    verification,
    sourceCount: z.number(),
    distinctDomains: z.number(),
    tierHistogram,
    memberIds: z.array(z.string()),
    earliestPublishedAt: z.string(),
    latestPublishedAt: z.string(),
    auditId: z.string(),
  })
  .passthrough();

const auditEntry = z.object({
  auditId: z.string(),
  clusterId: z.string(),
  topic: z.string(),
  inputs: z.record(z.string(), z.number()),
  weights: z.record(z.string(), z.number()),
  computed: scoreBreakdown,
  rationale: z.string(),
  weightProfile: z.string(),
  rankedAt: z.string(),
});

const rankingData = z.object({
  rankedByTopic: z.record(z.string(), z.array(rankedCluster)),
  audit: z.array(auditEntry),
  weightProfile: z.string(),
});

export const RankingArtifactSchema = makeEnvelopeSchema('ranking', rankingData);
export type RankingArtifactInput = z.input<typeof RankingArtifactSchema>;

// ---------------------------------------------------------------------------
// Stage 3 — Top10Artifact
// ---------------------------------------------------------------------------

const sourceRef = z.object({
  source: z.string(),
  sourceDomain: z.string(),
  tier: sourceTier,
  url: z.string(),
  title: z.string(),
  publishedAt: z.string(),
});

const top10Entry = z
  .object({
    rank: z.number().int().min(1).max(10),
    clusterId: z.string(),
    topic: z.string(),
    topicLabel: z.string(),
    headline: z.string(),
    score: scoreBreakdown,
    sourceQuality,
    confidence,
    references: z.array(sourceRef),
    delta: z.object({
      previousRank: z.number().nullable(),
      movement: z.enum(['new', 'up', 'down', 'same']),
    }),
    carriedOver: z.boolean(),
  })
  .passthrough();

const stabilityReport = z.object({
  carriedOver: z.number(),
  fresh: z.number(),
  churnRate: z.number().min(0).max(1),
});

const top10Data = z.object({
  nextRefreshAt: z.string(),
  topicsCovered: z.array(z.string()),
  top10ByTopic: z.record(z.string(), z.array(top10Entry)),
  global: z.array(top10Entry),
  stability: stabilityReport,
});

export const Top10ArtifactSchema = makeEnvelopeSchema('top10', top10Data);
export type Top10ArtifactInput = z.input<typeof Top10ArtifactSchema>;

// ---------------------------------------------------------------------------
// Stage 4 — ArticleArtifact
// ---------------------------------------------------------------------------

const articleBlock = z
  .object({
    type: z.enum(['paragraph', 'heading', 'list', 'quote', 'callout']),
    text: z.string().optional(),
    items: z.array(z.string()).optional(),
    attribution: z
      .object({
        source: z.string(),
        url: z.string(),
      })
      .optional(),
  })
  .passthrough();

const articleReference = z.object({
  source: z.string(),
  sourceDomain: z.string(),
  tier: sourceTier,
  url: z.string(),
  title: z.string(),
  publishedAt: z.string(),
});

const synthesizedArticle = z
  .object({
    id: z.string(),
    rank: z.number(),
    topic: z.string(),
    topicLabel: z.string(),
    headline: z.string(),
    dek: z.string(),
    body: z.array(articleBlock),
    keyPoints: z.array(z.string()),
    whyItMatters: z.string(),
    readerAction: z.string(),
    tags: z.array(z.string()),
    confidence,
    sourceQuality,
    references: z.array(articleReference),
    provenance: z.object({
      clusterId: z.string(),
      sourceCount: z.number(),
      distinctDomains: z.number(),
      upstreamRunId: z.string(),
    }),
    ai: providerMeta,
    legalNote: z.string(),
    wordCount: z.number(),
    readingTimeMinutes: z.number(),
    generatedAt: z.string(),
  })
  .passthrough();

const copyrightPolicy = z.object({
  originalTextOnly: z.literal(true),
  maxQuoteWords: z.number(),
  reproduceArticleBody: z.literal(false),
  requireAttribution: z.literal(true),
  requireCanonicalLinks: z.literal(true),
});

const articleData = z.object({
  articles: z.array(synthesizedArticle),
  copyrightPolicy,
});

export const ArticleArtifactSchema = makeEnvelopeSchema('articles', articleData);
export type ArticleArtifactInput = z.input<typeof ArticleArtifactSchema>;

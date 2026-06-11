/**
 * @ardurai/contracts/zod — Tier-2 structural Zod schemas + combined parse helpers.
 *
 * Requires the `zod` peer dependency (^3).
 * Import via the subpath so Tier-1-only consumers pull no zod dep:
 *
 *   import { parseAggregationArtifact } from '@ardurai/contracts/zod';
 *   const agg = parseAggregationArtifact(JSON.parse(raw));
 *
 * The per-stage helpers (parseAggregationArtifact, parseRankingArtifact, etc.) run
 * Tier-1 (assertCompatibleArtifact) + Tier-2 (Zod) in a single call — this is the
 * recommended API for engines. Raw schemas are also exported for advanced use.
 *
 * All schemas use .passthrough() on the envelope level to remain forward-compatible
 * with additive revisions — unknown fields are preserved, not stripped.
 *
 * Rev 3 additions: SourceDocumentSchema, FactProvenanceSchema, ExtractedFactSchema,
 *   MediaProvenanceSchema, ClaimProvenanceSchema; updated block union; optional fields
 *   on ScoreBreakdown, RankedCluster, Top10Entry, SynthesizedArticle, AggregationData.
 */

import { z } from 'zod';
import { SCHEMA_VERSION, assertCompatibleArtifact, type PipelineStage } from './index.ts';

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

// Rev 3 — read/extract layer

const extractionStatus = z.enum(['full', 'snippet', 'failed']);
const accessPolicy = z.enum(['allowed', 'paywalled', 'robots-disallowed', 'tos-restricted']);

export const SourceDocumentSchema = z.object({
  id: z.string(),
  url: z.string(),
  source: z.string(),
  sourceDomain: z.string(),
  tier: sourceTier,
  title: z.string(),
  publishedAt: z.string(),
  fetchedAt: z.string(),
  extraction: extractionStatus,
  accessPolicy: accessPolicy,
  wordCount: z.number().nullable(),
  lang: z.string().nullable(),
  contentHash: z.string(),
});
export type SourceDocumentInput = z.input<typeof SourceDocumentSchema>;

export const FactProvenanceSchema = z.object({
  sourceDocId: z.string(),
  sourceDomain: z.string(),
  url: z.string(),
  quote: z.string().optional(),
});
export type FactProvenanceInput = z.input<typeof FactProvenanceSchema>;

export const ExtractedFactSchema = z.object({
  id: z.string(),
  topic: z.string(),
  clusterId: z.string(),
  statement: z.string(),
  quantity: z
    .object({
      metric: z.string(),
      value: z.number(),
      unit: z.string().optional(),
      asOf: z.string().optional(),
    })
    .optional(),
  entities: z.array(z.string()),
  provenance: z.array(FactProvenanceSchema).min(1),
  corroboration: z.number().int().min(1),
  confidence,
  extractedBy: providerMeta,
});
export type ExtractedFactInput = z.input<typeof ExtractedFactSchema>;

const aggregationData = z
  .object({
    itemsByTopic: z.record(z.string(), z.array(aggregatedItem)),
    clustersByTopic: z.record(z.string(), z.array(cluster)),
    coverageByTopic: z.record(z.string(), sourceCoverage),
    // Rev 3 additive fields
    documentsByTopic: z.record(z.string(), z.array(SourceDocumentSchema)).optional(),
    factsByCluster: z.record(z.string(), z.array(ExtractedFactSchema)).optional(),
  })
  .passthrough();

export const AggregationArtifactSchema = makeEnvelopeSchema('aggregation', aggregationData);
export type AggregationArtifactInput = z.input<typeof AggregationArtifactSchema>;

// ---------------------------------------------------------------------------
// Stage 2 — RankingArtifact
// ---------------------------------------------------------------------------

const scoreBreakdown = z
  .object({
    interaction: z.number().finite(),
    credibility: z.number().finite(),
    corroboration: z.number().finite(),
    technicalSignificance: z.number().finite().optional(), // rev 3 additive
    recency: z.number().finite(),
    diversity: z.number().finite(),
    total: z.number().finite(), // NaN serialises as null in JSON — both are rejected here
    weights: z.record(z.string(), z.number().finite()),
  })
  .passthrough();

const tierHistogram = z
  .object({
    primary: z.number().optional(),
    paper: z.number().optional(),
    news: z.number().optional(),
    'technical-news': z.number().optional(),
    'security-news': z.number().optional(),
  })
  .passthrough();

const sourceRef = z.object({
  source: z.string(),
  sourceDomain: z.string(),
  tier: sourceTier,
  url: z.string(),
  title: z.string(),
  publishedAt: z.string(),
});

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
    // Rev 3 additive fields
    references: z.array(sourceRef).optional(),
    sourceDocIds: z.array(z.string()).optional(),
    gateStatus: z.enum(['auto', 'flagged', 'hold']).optional(),
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
    // Rev 3 additive field
    sourceDocIds: z.array(z.string()).optional(),
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

// Rev 3 — visual render blocks

export const MediaProvenanceSchema = z.object({
  origin: z.enum(['generated', 'openly-licensed']),
  license: z.string().optional(),
  creator: z.string().optional(),
  sourceUrl: z.string().optional(),
});
export type MediaProvenanceInput = z.input<typeof MediaProvenanceSchema>;

// Individual block schemas (exported for renderer use)

export const TextBlockSchema = z
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

export const ChartBlockSchema = z
  .object({
    type: z.literal('chart'),
    chartType: z.enum(['bar', 'line', 'area', 'scatter', 'pie']),
    title: z.string(),
    series: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        unit: z.string().optional(),
      }),
    ),
    factIds: z.array(z.string()),
    caption: z.string().optional(),
    attribution: z.object({
      sources: z.array(z.object({ source: z.string(), url: z.string() })),
    }),
  })
  .passthrough();

export const ImageBlockSchema = z
  .object({
    type: z.literal('image'),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    media: MediaProvenanceSchema,
  })
  .passthrough();

export const GifBlockSchema = z
  .object({
    type: z.literal('gif'),
    src: z.string(),
    alt: z.string(),
    poster: z.string().optional(),
    media: MediaProvenanceSchema,
  })
  .passthrough();

export const EmbedBlockSchema = z
  .object({
    type: z.literal('embed'),
    provider: z.string(),
    url: z.string(),
    title: z.string().optional(),
  })
  .passthrough();

// Catch-all for forward-compat unknown block types (renderer must skip, never throw)
const unknownBlockSchema = z.object({ type: z.string() }).passthrough();

/**
 * ArticleBlock union — tries each specific variant in order; unknown types fall
 * through to the catch-all so they are preserved rather than rejected.
 */
export const ArticleBlockSchema = z.union([
  TextBlockSchema,
  ChartBlockSchema,
  ImageBlockSchema,
  GifBlockSchema,
  EmbedBlockSchema,
  unknownBlockSchema,
]);

// Rev 3 — claim provenance

export const ClaimProvenanceSchema = z.object({
  blockIndex: z.number().int().min(0),
  text: z.string(),
  isEditorial: z.boolean(),
  factIds: z.array(z.string()),
  corroboration: z.number().int().min(0),
  confidence,
});
export type ClaimProvenanceInput = z.input<typeof ClaimProvenanceSchema>;

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
    body: z.array(ArticleBlockSchema),
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
    // Rev 3 additive fields
    editorialStatus: z.enum(['published', 'held', 'draft']).optional(),
    facts: z.array(ExtractedFactSchema).optional(),
    claims: z.array(ClaimProvenanceSchema).optional(),
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

// ---------------------------------------------------------------------------
// Combined Tier-1 + Tier-2 parse helpers (recommended engine API)
// ---------------------------------------------------------------------------

/**
 * Run Tier-1 envelope validation (assertCompatibleArtifact) then Tier-2 Zod
 * structural validation in a single call.
 *
 * Throws `SchemaVersionError` on envelope failures (wrong version, stage, missing
 * required fields). Throws `ZodError` on structural failures inside `data`.
 *
 * Usage:
 *   import { parseArtifact, AggregationArtifactSchema } from '@ardurai/contracts/zod';
 *   const agg = parseArtifact(raw, 'aggregation', AggregationArtifactSchema);
 */
export function parseArtifact<TSchema extends z.ZodTypeAny>(
  raw: unknown,
  stage: PipelineStage,
  schema: TSchema,
): z.output<TSchema> {
  assertCompatibleArtifact(raw, stage);
  return schema.parse(raw);
}

/** Parse + validate an aggregation artifact (Tier-1 + Tier-2). */
export const parseAggregationArtifact = (
  raw: unknown,
): z.output<typeof AggregationArtifactSchema> =>
  parseArtifact(raw, 'aggregation', AggregationArtifactSchema);

/** Parse + validate a ranking artifact (Tier-1 + Tier-2). */
export const parseRankingArtifact = (raw: unknown): z.output<typeof RankingArtifactSchema> =>
  parseArtifact(raw, 'ranking', RankingArtifactSchema);

/** Parse + validate a top-10 artifact (Tier-1 + Tier-2). */
export const parseTop10Artifact = (raw: unknown): z.output<typeof Top10ArtifactSchema> =>
  parseArtifact(raw, 'top10', Top10ArtifactSchema);

/** Parse + validate an article artifact (Tier-1 + Tier-2). */
export const parseArticleArtifact = (raw: unknown): z.output<typeof ArticleArtifactSchema> =>
  parseArtifact(raw, 'articles', ArticleArtifactSchema);

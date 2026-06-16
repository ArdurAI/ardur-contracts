/**
 * @ardurai/contracts — Shared wire contract for the Ardur AI content pipeline.
 *
 * Schema:           ardur-content-pipeline/v1
 * Contract revision: 5  (rev 5 adds Hermes as a first-class ProviderMeta.provider;
 *                        rev 4 adds Top10 signal IDs, summaries, and SignalLink graph edges;
 *                        rev 3 adds fact/provenance layer, visual ArticleBlock union,
 *                        uncapped source set, ScoreBreakdown.technicalSignificance,
 *                        RankedCluster.gateStatus/references, ClaimProvenance)
 *
 * The four engines exchange data through typed, versioned envelopes:
 *   ardur-news-aggregator → ardur-ranking-engine → ardur-top10-engine → ardur-article-synthesizer
 *
 * Design rules:
 *   - Every artifact is a versioned envelope tied to a single 6-hour cycle.
 *   - No PII: no user/session/device ids, IPs, emails, cookies, UTMs, or referrers.
 *     Interaction metrics are aggregate-only.
 *   - Copyright-safe: items carry metadata-derived hints and links, never
 *     reproduced article bodies. Facts carry original-expression statements +
 *     short quotes (<25 words) + canonical links only.
 *   - GATE BEFORE STAMP: always call assertCompatibleArtifact(raw, stage) on every
 *     inbound artifact BEFORE casting to a stage type. Re-stamping without gating
 *     silently launders incompatible upstream artifacts.
 *   - Renderer rule: unknown ArticleBlock.type ⇒ skip (or render a link-out fallback),
 *     never throw.
 *
 * Usage:
 *   import { assertCompatibleArtifact, SCHEMA_VERSION } from '@ardurai/contracts';
 *   // Tier-2 Zod schemas (requires 'zod' peer dep):
 *   import { AggregationArtifactSchema } from '@ardurai/contracts/zod';
 */

// ---------------------------------------------------------------------------
// Versioning
// ---------------------------------------------------------------------------

export const SCHEMA_VERSION = 'ardur-content-pipeline/v1' as const;

/**
 * Monotonic revision counter for additive (non-breaking) changes.
 * A revision bump never changes SCHEMA_VERSION on the wire — it is forward-compatible.
 *
 * Rev 1: baseline schema (all fields except `claims?`)
 * Rev 2: ratifies `claims?` on AggregatedItem (additive; absent == rev 1 producer)
 * Rev 3: ExtractedFact + FactProvenance + SourceDocument (fact/provenance layer);
 *        visual ArticleBlock union (chart/image/gif/embed); TextBlock named export;
 *        ScoreBreakdown.technicalSignificance?; RankedCluster.references?/sourceDocIds?/gateStatus?;
 *        Top10Entry.sourceDocIds?; ClaimProvenance + SynthesizedArticle.claims?/facts?/editorialStatus?
 * Rev 4: Top10Entry.signalId? (stable 8-char SHA-256 of headline) + Top10Entry.summary?
 *        (story-specific one-sentence lede, deterministic, 0 AI tokens);
 *        SignalLink type + Top10Data.links? (ENGINE-008 co-mention graph edges).
 * Rev 5: ProviderMeta.provider accepts `hermes` for Hermes-powered engine outputs.
 */
export const CONTRACT_REVISION = 5 as const;

// ---------------------------------------------------------------------------
// Primitive union types
// ---------------------------------------------------------------------------

/** Curated source trust tiers (mirrors news-sources.mjs on ardur.ai). */
export type SourceTier =
  | 'primary' // first-party vendor / standards body (openai.com, kubernetes.io, nist.gov)
  | 'paper' // research preprints (arxiv.org)
  | 'news' // general / financial press (reuters.com, bloomberg.com)
  | 'technical-news' // practitioner press (infoq.com, thenewstack.io)
  | 'security-news'; // security press (thehackernews.com)

export type Confidence = 'high' | 'medium' | 'low';

export type SourceQuality =
  | 'corroborated' // >= 2 distinct sources, >= 1 trusted
  | 'multi-source' // >= 2 distinct sources
  | 'single trusted source'
  | 'single source';

export type Verification = 'multi-source' | 'single-source';

export type PipelineStage = 'aggregation' | 'ranking' | 'top10' | 'articles';

/** Rev 3: result of attempting to fetch and extract an article body. */
export type ExtractionStatus = 'full' | 'snippet' | 'failed';

/** Rev 3: access classification for a fetched article URL. */
export type AccessPolicy = 'allowed' | 'paywalled' | 'robots-disallowed' | 'tos-restricted';

// ---------------------------------------------------------------------------
// Shared sub-types
// ---------------------------------------------------------------------------

/** Provenance for any AI-assisted field. Deterministic fallback always populated. */
export interface ProviderMeta {
  provider: 'deterministic' | 'ollama' | 'openai' | 'hermes';
  model: string;
  status: 'generated' | 'fallback';
  reason?: string;
  generatedAt: string; // ISO 8601 UTC
}

/** The 6-hour batch window an artifact belongs to. */
export interface CycleMeta {
  id: string; // stable window id, e.g. "2026-06-11T06:00:00.000Z"
  windowStart: string; // ISO 8601 UTC, inclusive
  windowEnd: string; // ISO 8601 UTC, exclusive (windowStart + 6 h)
}

export interface TopicMeta {
  id: string;
  label: string;
  description: string;
}

// ---------------------------------------------------------------------------
// ArtifactEnvelope
// ---------------------------------------------------------------------------

/**
 * Versioned envelope wrapping every inter-engine artifact. `data` is the
 * stage-specific payload (AggregationData | RankingData | Top10Data | ArticleData).
 */
export interface ArtifactEnvelope<TData> {
  schemaVersion: typeof SCHEMA_VERSION;
  /** Producer's CONTRACT_REVISION. Absent == rev 1 (legacy producer). */
  contractRevision?: number;
  artifact: PipelineStage;
  runId: string; // unique per stage execution
  upstreamRunId: string | null; // producing stage's runId (null for aggregation)
  generatedAt: string; // ISO 8601 UTC
  cycle: CycleMeta;
  topics: TopicMeta[];
  provider?: ProviderMeta; // present where AI is involved
  warnings: string[]; // non-fatal issues (source timeouts, budget exhaustion, …)
  data: TData;
}

// ---------------------------------------------------------------------------
// Stage 1 — Aggregation (ardur-news-aggregator)
// ---------------------------------------------------------------------------

/** Aggregate-only interaction signals. NEVER carries per-user data. */
export interface InteractionMetrics {
  feedRank: number | null; // 0-based position in the source feed
  shares: number | null;
  comments: number | null;
  reactions: number | null;
  crossSourceMentions: number; // distinct sources mentioning the cluster
  velocity: number | null; // mentions per hour across sources within the window
  capturedAt: string; // ISO 8601 UTC
  provenance: string; // human-readable metric origin (e.g. "rss-position")
}

export interface AggregatedItem {
  id: string;
  topic: string;
  topicLabel: string;
  title: string;
  source: string; // display name (e.g. "Reuters")
  sourceDomain: string; // canonical host (e.g. "reuters.com")
  sourceUrl: string; // normalized publisher root, may be ""
  url: string; // normalized public article URL, no PII, no fragment
  tier: SourceTier;
  publishedAt: string; // ISO 8601 UTC
  summaryHint: string; // metadata/feed-derived hint — NOT the article body
  interaction: InteractionMetrics;
  clusterId: string;
  fingerprint: string; // dedup key (normalized title + canonical url)
  /**
   * Key topic labels / named entities extracted from title + hint. ≤5 entries.
   * Additive field — rev 2. Absent on artifacts from rev-1 producers.
   */
  claims?: string[];
}

export interface Cluster {
  clusterId: string;
  topic: string;
  topicLabel: string;
  headline: string; // representative member title
  memberIds: string[]; // AggregatedItem.id values
  sourceCount: number; // distinct sources
  distinctDomains: number; // distinct source domains
  tierHistogram: Partial<Record<SourceTier, number>>;
  earliestPublishedAt: string;
  latestPublishedAt: string;
}

export interface SourceCoverage {
  sourcesConfigured: number; // sources targeted for the topic (target: >= 20)
  sourcesQueried: number;
  sourcesResponded: number;
  distinctDomains: number;
  degraded: boolean; // true if below the diversity floor
}

/**
 * Rev 3: metadata for a fetched source article. The BODY is never serialized here —
 * it lives only in the private ETL store for extraction + audit.
 */
export interface SourceDocument {
  id: string; // stable id (hash of canonical url)
  url: string; // canonical, no PII/fragment
  source: string;
  sourceDomain: string;
  tier: SourceTier;
  title: string;
  publishedAt: string; // ISO 8601 UTC
  fetchedAt: string; // ISO 8601 UTC
  extraction: ExtractionStatus;
  accessPolicy: AccessPolicy;
  wordCount: number | null;
  lang: string | null;
  contentHash: string; // dedup / change-detection
}

/** Rev 3: per-source attribution for an extracted fact. */
export interface FactProvenance {
  sourceDocId: string; // → SourceDocument.id
  sourceDomain: string;
  url: string; // canonical link for attribution
  quote?: string; // optional verbatim support, < 25 words
}

/** Rev 3: an atomic, original-expression fact extracted from one or more bodies. */
export interface ExtractedFact {
  id: string;
  topic: string;
  clusterId: string;
  statement: string; // original expression, not a copied sentence
  quantity?: {
    metric: string;
    value: number;
    unit?: string;
    asOf?: string; // ISO date the figure refers to
  };
  entities: string[];
  provenance: FactProvenance[]; // length >= 1, ALWAYS
  corroboration: number; // distinct source domains, >= 1
  confidence: Confidence;
  extractedBy: ProviderMeta;
}

export interface AggregationData {
  itemsByTopic: Record<string, AggregatedItem[]>;
  clustersByTopic: Record<string, Cluster[]>;
  coverageByTopic: Record<string, SourceCoverage>;
  /** Rev 3: fetched source document metadata, keyed by topic. Bodies never included. */
  documentsByTopic?: Record<string, SourceDocument[]>;
  /** Rev 3: extracted facts per cluster. */
  factsByCluster?: Record<string, ExtractedFact[]>;
}

export type AggregationArtifact = ArtifactEnvelope<AggregationData>;

// ---------------------------------------------------------------------------
// Stage 2 — Ranking (ardur-ranking-engine)
// ---------------------------------------------------------------------------

/** Per-signal contribution to a cluster's score. */
export interface ScoreBreakdown {
  interaction: number; // E
  credibility: number; // S
  corroboration: number; // C
  /** Rev 3: technical-significance signal value. Absent on rev-2 producers. */
  technicalSignificance?: number; // T
  recency: number; // MULTIPLIER (not an additive component)
  diversity: number; // MULTIPLIER
  total: number; // = recency × Σ(wᵢ·signalᵢ) × diversity
  weights: Record<string, number>; // weights actually applied
}

export interface RankedCluster {
  clusterId: string;
  topic: string;
  topicLabel: string;
  headline: string;
  rank: number; // 1-based within topic
  score: ScoreBreakdown;
  sourceQuality: SourceQuality;
  confidence: Confidence;
  verification: Verification;
  sourceCount: number;
  distinctDomains: number;
  tierHistogram: Partial<Record<SourceTier, number>>;
  memberIds: string[];
  earliestPublishedAt: string;
  latestPublishedAt: string;
  auditId: string; // -> AuditEntry.auditId
  /**
   * Rev 3: uncapped resolved references attached by the ranking engine so top-10
   * can skip loading the full AggregationArtifact (Option 2, design doc §6.1b).
   */
  references?: SourceRef[];
  /** Rev 3: SourceDocument.id values covering the cluster members. */
  sourceDocIds?: string[];
  /** Rev 3: editorial gate classification set by the ranking engine. */
  gateStatus?: 'auto' | 'flagged' | 'hold';
}

/** Fully reproducible record of how one cluster's score was computed. */
export interface AuditEntry {
  auditId: string;
  clusterId: string;
  topic: string;
  inputs: Record<string, number>; // raw signal values before weighting
  weights: Record<string, number>;
  computed: ScoreBreakdown;
  rationale: string;
  weightProfile: string; // named, versioned weight profile id
  rankedAt: string;
}

export interface RankingData {
  rankedByTopic: Record<string, RankedCluster[]>;
  audit: AuditEntry[];
  weightProfile: string; // e.g. "balanced@v1"
}

export type RankingArtifact = ArtifactEnvelope<RankingData>;

// ---------------------------------------------------------------------------
// Stage 3 — Top-10 (ardur-top10-engine)
// ---------------------------------------------------------------------------

/** Copyright-safe reference: link + attribution metadata, never article body. */
export interface SourceRef {
  source: string;
  sourceDomain: string;
  tier: SourceTier;
  url: string;
  title: string;
  publishedAt: string;
}

export interface Top10Entry {
  rank: number; // 1..10
  clusterId: string;
  topic: string;
  topicLabel: string;
  headline: string;
  score: ScoreBreakdown;
  sourceQuality: SourceQuality;
  confidence: Confidence;
  /** Display cap is a renderer concern; the data carries the full uncapped set. */
  references: SourceRef[];
  delta: {
    previousRank: number | null;
    movement: 'new' | 'up' | 'down' | 'same';
  };
  carriedOver: boolean; // present in the previous cycle's Top-10
  /** Rev 3: SourceDocument.id values for the full provenance set. */
  sourceDocIds?: string[];
  /** Rev 4: stable 8-char hex prefix of SHA-256(headline) — survives re-aggregation. */
  signalId?: string;
  /** Rev 4: story-specific one-sentence lede (≤ 20 words). Deterministic, 0 AI tokens. */
  summary?: string;
}

export interface StabilityReport {
  carriedOver: number;
  fresh: number; // newly entered this cycle
  churnRate: number; // 0..1 fraction replaced vs previous cycle
}

/**
 * Rev 4: directed co-mention edge between two Top-10 signals.
 * Produced by the ENGINE-008 graph pass from shared `factsByCluster` entities.
 */
export interface SignalLink {
  /** signalId (rev 4) or clusterId of signal A. */
  a: string;
  /** signalId (rev 4) or clusterId of signal B. */
  b: string;
  relation: 'same_project' | 'similar_to' | 'follows_up' | 'competes_with';
  /** 0..1 — proportional to shared-entity overlap. */
  weight: number;
}

export interface Top10Data {
  nextRefreshAt: string; // generatedAt + 6 h
  topicsCovered: string[];
  top10ByTopic: Record<string, Top10Entry[]>;
  global: Top10Entry[]; // the "all" Top-10
  stability: StabilityReport;
  /** Rev 4: co-mention graph edges from ENGINE-008 pass. Empty when no factsByCluster. */
  links?: SignalLink[];
}

export type Top10Artifact = ArtifactEnvelope<Top10Data>;

// ---------------------------------------------------------------------------
// Stage 4 — Article synthesis (ardur-article-synthesizer)
// ---------------------------------------------------------------------------

/**
 * Text-only in-app render block (5 original types, unchanged).
 * Rev 3: renamed from ArticleBlock to TextBlock; ArticleBlock is now the full union.
 */
export interface TextBlock {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'callout';
  text?: string; // for paragraph | heading | quote | callout
  items?: string[]; // for list
  /** Quotes must be < 25 words and carry attribution. */
  attribution?: { source: string; url: string };
}

/** Rev 3: chart block built exclusively from ExtractedFact.quantity values. */
export interface ChartBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'area' | 'scatter' | 'pie';
  title: string;
  series: Array<{ label: string; value: number; unit?: string }>;
  factIds: string[]; // → ExtractedFact.id (every datapoint traces back)
  caption?: string;
  attribution: { sources: Array<{ source: string; url: string }> };
}

/** Rev 3: provenance for generated or openly-licensed media. */
export interface MediaProvenance {
  origin: 'generated' | 'openly-licensed';
  license?: string; // required when openly-licensed (e.g. "CC0", "CC-BY-4.0")
  creator?: string;
  sourceUrl?: string;
}

/** Rev 3: image block; only generated or openly-licensed images. */
export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  media: MediaProvenance;
}

/** Rev 3: GIF/animation block; rendered as looping video where possible. */
export interface GifBlock {
  type: 'gif';
  src: string;
  alt: string;
  poster?: string;
  media: MediaProvenance;
}

/** Rev 3: embed block; allowlisted providers only. */
export interface EmbedBlock {
  type: 'embed';
  provider: string;
  url: string;
  title?: string;
}

/**
 * In-app render block union.
 * Rev 3: extended from TextBlock-only to include chart/image/gif/embed variants.
 * Renderer rule: unknown `type` ⇒ skip/fallback, never throw.
 */
export type ArticleBlock = TextBlock | ChartBlock | ImageBlock | GifBlock | EmbedBlock;

/**
 * Rev 3: per-claim mapping from an article sentence to the ExtractedFacts that
 * ground it. Promoted from the synthesizer's internal ProvenanceMap so the gate
 * and the source-trail UI share one canonical type.
 */
export interface ClaimProvenance {
  blockIndex: number; // which ArticleBlock the claim sentence lives in
  text: string; // the claim-bearing sentence
  isEditorial: boolean; // editorial/transition lines are not fact-gated
  factIds: string[]; // ExtractedFact.id values grounding it (≥1 for non-editorial)
  corroboration: number; // distinct source domains across those facts
  confidence: Confidence;
}

export interface ArticleReference {
  source: string;
  sourceDomain: string;
  tier: SourceTier;
  url: string;
  title: string;
  publishedAt: string;
}

export interface SynthesizedArticle {
  id: string;
  rank: number; // mirrors the Top-10 rank it was synthesized from
  topic: string;
  topicLabel: string;
  headline: string;
  dek: string; // original standfirst / subtitle
  body: ArticleBlock[];
  keyPoints: string[];
  whyItMatters: string;
  readerAction: string;
  tags: string[];
  confidence: Confidence;
  sourceQuality: SourceQuality;
  references: ArticleReference[];
  provenance: {
    clusterId: string;
    sourceCount: number;
    distinctDomains: number;
    upstreamRunId: string;
  };
  ai: ProviderMeta;
  legalNote: string;
  wordCount: number;
  readingTimeMinutes: number;
  generatedAt: string;
  /**
   * Rev 3: editorial lifecycle status. 'held' means the provenance gate failed
   * and the piece must not be published to readers. Absent == 'published' (legacy).
   */
  editorialStatus?: 'published' | 'held' | 'draft';
  /** Rev 3: the ExtractedFacts used to write this article (for source-trail UI). */
  facts?: ExtractedFact[];
  /** Rev 3: per-sentence claim→fact mapping produced by the provenance gate. */
  claims?: ClaimProvenance[];
}

export interface CopyrightPolicy {
  originalTextOnly: true;
  maxQuoteWords: number; // default 25
  reproduceArticleBody: false;
  requireAttribution: true;
  requireCanonicalLinks: true;
}

export interface ArticleData {
  articles: SynthesizedArticle[];
  copyrightPolicy: CopyrightPolicy;
}

export type ArticleArtifact = ArtifactEnvelope<ArticleData>;

// ---------------------------------------------------------------------------
// Cross-stage constants
// ---------------------------------------------------------------------------

/** Forbidden substrings in any metric key — privacy guard reused by every engine. */
export const FORBIDDEN_METRIC_KEY_FRAGMENTS: readonly string[] = [
  'userid',
  'visitorid',
  'deviceid',
  'accountid',
  'session',
  'cookie',
  'token',
  'secret',
  'email',
  'phone',
  'ipaddress',
  'useragent',
  'fingerprint',
  'referrer',
  'referer',
  'utm',
  'campaign',
  'rawevent',
];

/** Canonical 6-hour cycle length in milliseconds. */
export const CYCLE_INTERVAL_MS = 6 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Tier-1 gate (zero-dependency)
// ---------------------------------------------------------------------------

export class SchemaVersionError extends Error {
  readonly detail: { expected: string; received: unknown; stage: string };

  constructor(detail: { expected: string; received: unknown; stage: string }) {
    super(
      `schemaVersion mismatch for ${detail.stage}: expected "${detail.expected}", ` +
        `received ${JSON.stringify(detail.received)}`,
    );
    this.name = 'SchemaVersionError';
    this.detail = detail;
  }
}

export interface ArtifactCheck<TStage extends PipelineStage> {
  /** The validated envelope (data shape verified at Tier-1; cast to the specific artifact type). */
  envelope: ArtifactEnvelope<unknown>;
  /** Non-fatal warnings, e.g. forward-revision skew. Surface these; do not fail. */
  warnings: string[];
  /** Echo of the stage validated (useful for logging). */
  stage: TStage;
}

/**
 * Tier-1 gate. Run on every inbound artifact BEFORE casting to a stage type.
 *
 * Throws SchemaVersionError when:
 *   - `raw` is not an object / is null
 *   - `raw.schemaVersion` !== SCHEMA_VERSION  (major drift — hard fail)
 *   - `raw.artifact` !== expectedStage        (wrong upstream wired in — hard fail)
 *   - `raw.data` is not a non-null object     (structurally broken envelope)
 *   - `raw.runId` is not a non-empty string   (required for audit trail)
 *   - `raw.generatedAt` is not a string       (required for cycle validation)
 *   - `raw.cycle` is not a non-null object with string id/windowStart/windowEnd
 *   - `raw.topics` is not an array            (required for stage iteration)
 *   - `raw.warnings` is not an array          (required for surfacing non-fatal issues)
 *
 * Returns non-fatal warnings when:
 *   - `raw.contractRevision > CONTRACT_REVISION` (forward-compat: additive fields may be ignored)
 *
 * Usage:
 *   const { envelope, warnings } = assertCompatibleArtifact(JSON.parse(raw), 'aggregation');
 *   // surface warnings, then:
 *   const agg = envelope as AggregationArtifact;
 *   // For full structural validation of `data`, follow up with the Tier-2 Zod schemas:
 *   import { parseAggregationArtifact } from '@ardurai/contracts/zod';
 */
export function assertCompatibleArtifact<TStage extends PipelineStage>(
  raw: unknown,
  expectedStage: TStage,
): ArtifactCheck<TStage> {
  if (typeof raw !== 'object' || raw === null) {
    throw new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: raw,
      stage: expectedStage,
    });
  }

  const env = raw as Partial<ArtifactEnvelope<unknown>>;

  if (env.schemaVersion !== SCHEMA_VERSION) {
    throw new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: env.schemaVersion,
      stage: expectedStage,
    });
  }

  if (env.artifact !== expectedStage) {
    throw new SchemaVersionError({
      expected: `artifact=${expectedStage}`,
      received: env.artifact,
      stage: expectedStage,
    });
  }

  if (typeof env.data !== 'object' || env.data === null || Array.isArray(env.data)) {
    throw new SchemaVersionError({
      expected: 'non-null object at .data',
      received: env.data,
      stage: expectedStage,
    });
  }

  if (typeof env.runId !== 'string' || env.runId.trim() === '') {
    throw new SchemaVersionError({
      expected: 'non-empty string at .runId',
      received: env.runId,
      stage: expectedStage,
    });
  }

  const upId = env.upstreamRunId;
  if (upId !== null && upId !== undefined && (typeof upId !== 'string' || upId.trim() === '')) {
    throw new SchemaVersionError({
      expected: 'non-empty string or null at .upstreamRunId',
      received: upId,
      stage: expectedStage,
    });
  }

  if (typeof env.generatedAt !== 'string') {
    throw new SchemaVersionError({
      expected: 'string at .generatedAt',
      received: env.generatedAt,
      stage: expectedStage,
    });
  }

  if (typeof env.cycle !== 'object' || env.cycle === null) {
    throw new SchemaVersionError({
      expected: 'non-null object at .cycle',
      received: env.cycle,
      stage: expectedStage,
    });
  }

  const cycle = env.cycle as unknown as Record<string, unknown>;
  if (
    typeof cycle['id'] !== 'string' ||
    typeof cycle['windowStart'] !== 'string' ||
    typeof cycle['windowEnd'] !== 'string'
  ) {
    throw new SchemaVersionError({
      expected: 'string id/windowStart/windowEnd at .cycle',
      received: env.cycle,
      stage: expectedStage,
    });
  }

  if (!Array.isArray(env.topics)) {
    throw new SchemaVersionError({
      expected: 'array at .topics',
      received: env.topics,
      stage: expectedStage,
    });
  }

  if (!Array.isArray(env.warnings)) {
    throw new SchemaVersionError({
      expected: 'array at .warnings',
      received: env.warnings,
      stage: expectedStage,
    });
  }

  if (env.contractRevision !== undefined) {
    const cr = env.contractRevision as unknown;
    if (
      typeof cr !== 'number' ||
      !Number.isFinite(cr as number) ||
      !Number.isInteger(cr as number) ||
      (cr as number) < 1
    ) {
      throw new SchemaVersionError({
        expected: 'positive integer at .contractRevision',
        received: cr,
        stage: expectedStage,
      });
    }
  }

  const warnings: string[] = [];
  const rev = typeof env.contractRevision === 'number' ? env.contractRevision : 1;
  if (rev > CONTRACT_REVISION) {
    warnings.push(
      `upstream contractRevision ${rev} > local ${CONTRACT_REVISION}; ` +
        `additive fields may be ignored (forward-compatible)`,
    );
  }

  return { envelope: env as ArtifactEnvelope<unknown>, warnings, stage: expectedStage };
}

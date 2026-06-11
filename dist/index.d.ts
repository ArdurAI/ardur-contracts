/**
 * @ardurai/contracts — Shared wire contract for the Ardur AI content pipeline.
 *
 * Schema:           ardur-content-pipeline/v1
 * Contract revision: 2  (rev 2 ratifies `claims?` on AggregatedItem)
 *
 * The four engines exchange data through typed, versioned envelopes:
 *   ardur-news-aggregator → ardur-ranking-engine → ardur-top10-engine → ardur-article-synthesizer
 *
 * Design rules:
 *   - Every artifact is a versioned envelope tied to a single 6-hour cycle.
 *   - No PII: no user/session/device ids, IPs, emails, cookies, UTMs, or referrers.
 *     Interaction metrics are aggregate-only.
 *   - Copyright-safe: items carry metadata-derived hints and links, never
 *     reproduced article bodies.
 *   - GATE BEFORE STAMP: always call assertCompatibleArtifact(raw, stage) on every
 *     inbound artifact BEFORE casting to a stage type. Re-stamping without gating
 *     silently launders incompatible upstream artifacts.
 *
 * Usage:
 *   import { assertCompatibleArtifact, SCHEMA_VERSION } from '@ardurai/contracts';
 *   // Tier-2 Zod schemas (requires 'zod' peer dep):
 *   import { AggregationArtifactSchema } from '@ardurai/contracts/zod';
 */
export declare const SCHEMA_VERSION: "ardur-content-pipeline/v1";
/**
 * Monotonic revision counter for additive (non-breaking) changes.
 * A revision bump never changes SCHEMA_VERSION on the wire — it is forward-compatible.
 *
 * Rev 1: baseline schema (all fields except `claims?`)
 * Rev 2: ratifies `claims?` on AggregatedItem (additive; absent == rev 1 producer)
 */
export declare const CONTRACT_REVISION: 2;
/** Curated source trust tiers (mirrors news-sources.mjs on ardur.ai). */
export type SourceTier = 'primary' | 'paper' | 'news' | 'technical-news' | 'security-news';
export type Confidence = 'high' | 'medium' | 'low';
export type SourceQuality = 'corroborated' | 'multi-source' | 'single trusted source' | 'single source';
export type Verification = 'multi-source' | 'single-source';
export type PipelineStage = 'aggregation' | 'ranking' | 'top10' | 'articles';
/** Provenance for any AI-assisted field. Deterministic fallback always populated. */
export interface ProviderMeta {
    provider: 'deterministic' | 'ollama' | 'openai';
    model: string;
    status: 'generated' | 'fallback';
    reason?: string;
    generatedAt: string;
}
/** The 6-hour batch window an artifact belongs to. */
export interface CycleMeta {
    id: string;
    windowStart: string;
    windowEnd: string;
}
export interface TopicMeta {
    id: string;
    label: string;
    description: string;
}
/**
 * Versioned envelope wrapping every inter-engine artifact. `data` is the
 * stage-specific payload (AggregationData | RankingData | Top10Data | ArticleData).
 */
export interface ArtifactEnvelope<TData> {
    schemaVersion: typeof SCHEMA_VERSION;
    /** Producer's CONTRACT_REVISION. Absent == rev 1 (legacy producer). */
    contractRevision?: number;
    artifact: PipelineStage;
    runId: string;
    upstreamRunId: string | null;
    generatedAt: string;
    cycle: CycleMeta;
    topics: TopicMeta[];
    provider?: ProviderMeta;
    warnings: string[];
    data: TData;
}
/** Aggregate-only interaction signals. NEVER carries per-user data. */
export interface InteractionMetrics {
    feedRank: number | null;
    shares: number | null;
    comments: number | null;
    reactions: number | null;
    crossSourceMentions: number;
    velocity: number | null;
    capturedAt: string;
    provenance: string;
}
export interface AggregatedItem {
    id: string;
    topic: string;
    topicLabel: string;
    title: string;
    source: string;
    sourceDomain: string;
    sourceUrl: string;
    url: string;
    tier: SourceTier;
    publishedAt: string;
    summaryHint: string;
    interaction: InteractionMetrics;
    clusterId: string;
    fingerprint: string;
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
    headline: string;
    memberIds: string[];
    sourceCount: number;
    distinctDomains: number;
    tierHistogram: Partial<Record<SourceTier, number>>;
    earliestPublishedAt: string;
    latestPublishedAt: string;
}
export interface SourceCoverage {
    sourcesConfigured: number;
    sourcesQueried: number;
    sourcesResponded: number;
    distinctDomains: number;
    degraded: boolean;
}
export interface AggregationData {
    itemsByTopic: Record<string, AggregatedItem[]>;
    clustersByTopic: Record<string, Cluster[]>;
    coverageByTopic: Record<string, SourceCoverage>;
}
export type AggregationArtifact = ArtifactEnvelope<AggregationData>;
/** Per-signal contribution to a cluster's score. */
export interface ScoreBreakdown {
    interaction: number;
    credibility: number;
    recency: number;
    diversity: number;
    corroboration: number;
    total: number;
    weights: Record<string, number>;
}
export interface RankedCluster {
    clusterId: string;
    topic: string;
    topicLabel: string;
    headline: string;
    rank: number;
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
    auditId: string;
}
/** Fully reproducible record of how one cluster's score was computed. */
export interface AuditEntry {
    auditId: string;
    clusterId: string;
    topic: string;
    inputs: Record<string, number>;
    weights: Record<string, number>;
    computed: ScoreBreakdown;
    rationale: string;
    weightProfile: string;
    rankedAt: string;
}
export interface RankingData {
    rankedByTopic: Record<string, RankedCluster[]>;
    audit: AuditEntry[];
    weightProfile: string;
}
export type RankingArtifact = ArtifactEnvelope<RankingData>;
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
    rank: number;
    clusterId: string;
    topic: string;
    topicLabel: string;
    headline: string;
    score: ScoreBreakdown;
    sourceQuality: SourceQuality;
    confidence: Confidence;
    references: SourceRef[];
    delta: {
        previousRank: number | null;
        movement: 'new' | 'up' | 'down' | 'same';
    };
    carriedOver: boolean;
}
export interface StabilityReport {
    carriedOver: number;
    fresh: number;
    churnRate: number;
}
export interface Top10Data {
    nextRefreshAt: string;
    topicsCovered: string[];
    top10ByTopic: Record<string, Top10Entry[]>;
    global: Top10Entry[];
    stability: StabilityReport;
}
export type Top10Artifact = ArtifactEnvelope<Top10Data>;
/** In-app render block. The app renders these with no navigation away. */
export interface ArticleBlock {
    type: 'paragraph' | 'heading' | 'list' | 'quote' | 'callout';
    text?: string;
    items?: string[];
    /** Quotes must be < 25 words and carry attribution. */
    attribution?: {
        source: string;
        url: string;
    };
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
    rank: number;
    topic: string;
    topicLabel: string;
    headline: string;
    dek: string;
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
}
export interface CopyrightPolicy {
    originalTextOnly: true;
    maxQuoteWords: number;
    reproduceArticleBody: false;
    requireAttribution: true;
    requireCanonicalLinks: true;
}
export interface ArticleData {
    articles: SynthesizedArticle[];
    copyrightPolicy: CopyrightPolicy;
}
export type ArticleArtifact = ArtifactEnvelope<ArticleData>;
/** Forbidden substrings in any metric key — privacy guard reused by every engine. */
export declare const FORBIDDEN_METRIC_KEY_FRAGMENTS: readonly string[];
/** Canonical 6-hour cycle length in milliseconds. */
export declare const CYCLE_INTERVAL_MS: number;
export declare class SchemaVersionError extends Error {
    readonly detail: {
        expected: string;
        received: unknown;
        stage: string;
    };
    constructor(detail: {
        expected: string;
        received: unknown;
        stage: string;
    });
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
 *
 * Returns non-fatal warnings when:
 *   - `raw.contractRevision > CONTRACT_REVISION` (forward-compat: additive fields may be ignored)
 *
 * Usage:
 *   const { envelope, warnings } = assertCompatibleArtifact(JSON.parse(raw), 'aggregation');
 *   // surface warnings, then:
 *   const agg = envelope as AggregationArtifact;
 */
export declare function assertCompatibleArtifact<TStage extends PipelineStage>(raw: unknown, expectedStage: TStage): ArtifactCheck<TStage>;

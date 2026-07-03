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
export declare const SCHEMA_VERSION: "ardur-content-pipeline/v1";
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
export declare const CONTRACT_REVISION: 5;
/** Curated source trust tiers (mirrors news-sources.mjs on ardur.ai). */
export type SourceTier = 'primary' | 'paper' | 'news' | 'technical-news' | 'security-news';
export type Confidence = 'high' | 'medium' | 'low';
export type SourceQuality = 'corroborated' | 'multi-source' | 'single trusted source' | 'single source';
export type Verification = 'multi-source' | 'single-source';
export type PipelineStage = 'aggregation' | 'ranking' | 'top10' | 'articles';
/** Rev 3: result of attempting to fetch and extract an article body. */
export type ExtractionStatus = 'full' | 'snippet' | 'failed';
/** Rev 3: access classification for a fetched article URL. */
export type AccessPolicy = 'allowed' | 'paywalled' | 'robots-disallowed' | 'tos-restricted';
/** Provenance for any AI-assisted field. Deterministic fallback always populated. */
export interface ProviderMeta {
    provider: 'deterministic' | 'ollama' | 'openai' | 'hermes';
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
/**
 * Rev 3: metadata for a fetched source article. The BODY is never serialized here —
 * it lives only in the private ETL store for extraction + audit.
 */
export interface SourceDocument {
    id: string;
    url: string;
    source: string;
    sourceDomain: string;
    tier: SourceTier;
    title: string;
    publishedAt: string;
    fetchedAt: string;
    extraction: ExtractionStatus;
    accessPolicy: AccessPolicy;
    wordCount: number | null;
    lang: string | null;
    contentHash: string;
}
/** Rev 3: per-source attribution for an extracted fact. */
export interface FactProvenance {
    sourceDocId: string;
    sourceDomain: string;
    url: string;
    quote?: string;
}
/** Rev 3: an atomic, original-expression fact extracted from one or more bodies. */
export interface ExtractedFact {
    id: string;
    topic: string;
    clusterId: string;
    statement: string;
    quantity?: {
        metric: string;
        value: number;
        unit?: string;
        asOf?: string;
    };
    entities: string[];
    provenance: FactProvenance[];
    corroboration: number;
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
/** Per-signal contribution to a cluster's score. */
export interface ScoreBreakdown {
    interaction: number;
    credibility: number;
    corroboration: number;
    /** Rev 3: technical-significance signal value. Absent on rev-2 producers. */
    technicalSignificance?: number;
    recency: number;
    diversity: number;
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
    /** Display cap is a renderer concern; the data carries the full uncapped set. */
    references: SourceRef[];
    delta: {
        previousRank: number | null;
        movement: 'new' | 'up' | 'down' | 'same';
    };
    carriedOver: boolean;
    /** Rev 3: SourceDocument.id values for the full provenance set. */
    sourceDocIds?: string[];
    /** Rev 4: stable 8-char hex prefix of SHA-256(headline) — survives re-aggregation. */
    signalId?: string;
    /**
     * Rev 4: story-specific one-sentence lede (≤ 20 words). Deterministic, 0 AI tokens.
     * Subsumes the `tickerSummary` role — use this field for all ticker / kicker / lede rendering.
     */
    summary?: string;
}
export interface StabilityReport {
    carriedOver: number;
    fresh: number;
    churnRate: number;
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
    nextRefreshAt: string;
    topicsCovered: string[];
    top10ByTopic: Record<string, Top10Entry[]>;
    global: Top10Entry[];
    stability: StabilityReport;
    /** Rev 4: co-mention graph edges from ENGINE-008 pass. Empty when no factsByCluster. */
    links?: SignalLink[];
}
export type Top10Artifact = ArtifactEnvelope<Top10Data>;
/**
 * Text-only in-app render block (5 original types, unchanged).
 * Rev 3: renamed from ArticleBlock to TextBlock; ArticleBlock is now the full union.
 */
export interface TextBlock {
    type: 'paragraph' | 'heading' | 'list' | 'quote' | 'callout';
    text?: string;
    items?: string[];
    /** Quotes must be < 25 words and carry attribution. */
    attribution?: {
        source: string;
        url: string;
    };
}
/** Rev 3: chart block built exclusively from ExtractedFact.quantity values. */
export interface ChartBlock {
    type: 'chart';
    chartType: 'bar' | 'line' | 'area' | 'scatter' | 'pie';
    title: string;
    series: Array<{
        label: string;
        value: number;
        unit?: string;
    }>;
    factIds: string[];
    caption?: string;
    attribution: {
        sources: Array<{
            source: string;
            url: string;
        }>;
    };
}
/** Rev 3: provenance for generated or openly-licensed media. */
export interface MediaProvenance {
    origin: 'generated' | 'openly-licensed';
    license?: string;
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
    blockIndex: number;
    text: string;
    isEditorial: boolean;
    factIds: string[];
    corroboration: number;
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
export declare function assertCompatibleArtifact<TStage extends PipelineStage>(raw: unknown, expectedStage: TStage): ArtifactCheck<TStage>;
/**
 * Normalize any date-like value to a strict ISO 8601 UTC datetime string
 * (the format required by the Zod schema's `z.string().datetime()` constraint).
 *
 * Handles:
 *   - RFC 2822 dates from RSS feeds ("Wed, 02 Jul 2025 14:30:00 GMT")
 *   - ISO 8601 strings with or without milliseconds
 *   - Date objects
 *   - Epoch numbers
 *
 * Falls back to `fallback` (default: current time) when the input is unparseable.
 */
export declare function normalizeToIsoDatetime(value: unknown, fallback?: string): string;

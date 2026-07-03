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
export const SCHEMA_VERSION = 'ardur-content-pipeline/v1';
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
export const CONTRACT_REVISION = 5;
// ---------------------------------------------------------------------------
// Cross-stage constants
// ---------------------------------------------------------------------------
/** Forbidden substrings in any metric key — privacy guard reused by every engine. */
export const FORBIDDEN_METRIC_KEY_FRAGMENTS = [
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
    detail;
    constructor(detail) {
        super(`schemaVersion mismatch for ${detail.stage}: expected "${detail.expected}", ` +
            `received ${JSON.stringify(detail.received)}`);
        this.name = 'SchemaVersionError';
        this.detail = detail;
    }
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
export function assertCompatibleArtifact(raw, expectedStage) {
    if (typeof raw !== 'object' || raw === null) {
        throw new SchemaVersionError({
            expected: SCHEMA_VERSION,
            received: raw,
            stage: expectedStage,
        });
    }
    const env = raw;
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
    const cycle = env.cycle;
    if (typeof cycle['id'] !== 'string' ||
        typeof cycle['windowStart'] !== 'string' ||
        typeof cycle['windowEnd'] !== 'string') {
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
        const cr = env.contractRevision;
        if (typeof cr !== 'number' ||
            !Number.isFinite(cr) ||
            !Number.isInteger(cr) ||
            cr < 1) {
            throw new SchemaVersionError({
                expected: 'positive integer at .contractRevision',
                received: cr,
                stage: expectedStage,
            });
        }
    }
    const warnings = [];
    const rev = typeof env.contractRevision === 'number' ? env.contractRevision : 1;
    if (rev > CONTRACT_REVISION) {
        warnings.push(`upstream contractRevision ${rev} > local ${CONTRACT_REVISION}; ` +
            `additive fields may be ignored (forward-compatible)`);
    }
    return { envelope: env, warnings, stage: expectedStage };
}
// ---------------------------------------------------------------------------
// Shared utilities for engine producers
// ---------------------------------------------------------------------------
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
export function normalizeToIsoDatetime(value, fallback) {
    if (typeof value === 'string' && value) {
        // Fast path: already a valid ISO 8601 datetime
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) {
            return value.includes('.') ? value : value.replace('Z', '.000Z');
        }
        const parsed = new Date(value);
        if (Number.isFinite(parsed.valueOf()))
            return parsed.toISOString();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return new Date(value).toISOString();
    }
    if (value instanceof Date && Number.isFinite(value.valueOf())) {
        return value.toISOString();
    }
    return fallback ?? new Date().toISOString();
}

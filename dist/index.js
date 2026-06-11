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
 */
export const CONTRACT_REVISION = 2;
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
 *
 * Returns non-fatal warnings when:
 *   - `raw.contractRevision > CONTRACT_REVISION` (forward-compat: additive fields may be ignored)
 *
 * Usage:
 *   const { envelope, warnings } = assertCompatibleArtifact(JSON.parse(raw), 'aggregation');
 *   // surface warnings, then:
 *   const agg = envelope as AggregationArtifact;
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
    if (typeof env.data !== 'object' || env.data === null) {
        throw new SchemaVersionError({
            expected: 'non-null object at .data',
            received: env.data,
            stage: expectedStage,
        });
    }
    const warnings = [];
    const rev = typeof env.contractRevision === 'number' ? env.contractRevision : 1;
    if (rev > CONTRACT_REVISION) {
        warnings.push(`upstream contractRevision ${rev} > local ${CONTRACT_REVISION}; ` +
            `additive fields may be ignored (forward-compatible)`);
    }
    return { envelope: env, warnings, stage: expectedStage };
}

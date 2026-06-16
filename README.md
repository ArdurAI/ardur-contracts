# @ardurai/contracts

Shared wire contract for the [Ardur AI](https://github.com/ArdurAI) content pipeline.

Four engines exchange typed, versioned artifacts through this package:

```
ardur-news-aggregator → ardur-ranking-engine → ardur-top10-engine → ardur-article-synthesizer
```

**Schema:** `ardur-content-pipeline/v1`  
**Contract revision:** `5` (rev 5 adds Hermes provider metadata compatibility; rev 4 adds Top-10 signal IDs, summaries, and graph links; rev 3 adds fact/provenance layer, visual blocks, uncapped sources)
**npm:** `@ardurai/contracts`

---

## Installation

```bash
npm install @ardurai/contracts
```

Tier-2 Zod schemas live in a separate subpath — install `zod` only when you need them:

```bash
npm install @ardurai/contracts zod
```

---

## Exports

### Main export — `@ardurai/contracts`

Zero runtime dependencies. Provides:

- All TypeScript types and interfaces for the four pipeline stages
- `SCHEMA_VERSION`, `CONTRACT_REVISION`, `CYCLE_INTERVAL_MS`, `FORBIDDEN_METRIC_KEY_FRAGMENTS`
- `assertCompatibleArtifact(raw, stage)` — **Tier-1 gate** (see below)
- `SchemaVersionError` — thrown on incompatible version or wrong stage

### Subpath export — `@ardurai/contracts/zod`

Requires `zod ^3` peer dependency. Provides full structural Zod schemas:

- `AggregationArtifactSchema`
- `RankingArtifactSchema`
- `Top10ArtifactSchema`
- `ArticleArtifactSchema`
- `SourceDocumentSchema`, `FactProvenanceSchema`, `ExtractedFactSchema` (rev 3)
- `MediaProvenanceSchema`, `ClaimProvenanceSchema` (rev 3)
- `TextBlockSchema`, `ChartBlockSchema`, `ImageBlockSchema`, `GifBlockSchema`, `EmbedBlockSchema`, `ArticleBlockSchema` (rev 3)

---

## The gate-before-stamp rule

Every engine reads upstream output with `JSON.parse(raw) as XArtifact`. Without a
version check, an incompatible upstream artifact is **silently laundered** into a v1-looking
output when re-stamped.

**Always call `assertCompatibleArtifact` before the cast:**

```ts
import { assertCompatibleArtifact, type AggregationArtifact } from '@ardurai/contracts';

const raw = JSON.parse(stdin);

// Gate BEFORE the cast. Throws SchemaVersionError on version mismatch or wrong stage.
const { envelope, warnings } = assertCompatibleArtifact(raw, 'aggregation');

// Surface non-fatal warnings (e.g. forward-revision skew).
for (const w of warnings) logger.warn(w);

// Safe to cast — envelope is a valid AggregationArtifact envelope.
const agg = envelope as AggregationArtifact;
```

**Tier-2 (Zod) at ingestion boundaries:**

```ts
import { AggregationArtifactSchema } from '@ardurai/contracts/zod';

const result = AggregationArtifactSchema.safeParse(JSON.parse(stdin));
if (!result.success) {
  throw new Error(`Invalid artifact: ${result.error.message}`);
}
const agg = result.data; // fully typed
```

---

## API reference

### `assertCompatibleArtifact<TStage>(raw, expectedStage)`

**Throws `SchemaVersionError` when:**
- `raw` is not a non-null object
- `raw.schemaVersion !== SCHEMA_VERSION` (major drift)
- `raw.artifact !== expectedStage` (wrong upstream wired in)
- `raw.data` is not a non-null object (broken envelope)

**Returns `{ envelope, warnings, stage }` when:**
- All hard checks pass
- `warnings` is non-empty if `raw.contractRevision > CONTRACT_REVISION` (forward-compat)

### `SchemaVersionError`

```ts
class SchemaVersionError extends Error {
  readonly detail: { expected: string; received: unknown; stage: string };
}
```

Thrown by `assertCompatibleArtifact` on hard failures. `err.detail` carries structured
context for logging.

### Constants

| Export | Value | Description |
|--------|-------|-------------|
| `SCHEMA_VERSION` | `'ardur-content-pipeline/v1'` | Major compatibility key. Hard-fail gate if mismatched. |
| `CONTRACT_REVISION` | `3` | Monotonic additive counter. Rev 3 adds fact/provenance + visual blocks. |
| `CYCLE_INTERVAL_MS` | `21600000` | 6-hour cycle length in milliseconds. |
| `FORBIDDEN_METRIC_KEY_FRAGMENTS` | `readonly string[]` | Privacy guard: reject metric keys containing these substrings. |

### Types

All pipeline-stage types are exported from the main entry:

| Type | Description |
|------|-------------|
| `ArtifactEnvelope<TData>` | Versioned wrapper for all stage artifacts |
| `AggregationArtifact` | Stage 1 output (news items + clusters) |
| `RankingArtifact` | Stage 2 output (scored + ranked clusters) |
| `Top10Artifact` | Stage 3 output (global Top-10 + per-topic) |
| `ArticleArtifact` | Stage 4 output (synthesized articles) |
| `PipelineStage` | `'aggregation' \| 'ranking' \| 'top10' \| 'articles'` |
| `SourceTier` | Trust tier enum for news sources |
| `Confidence` | `'high' \| 'medium' \| 'low'` |
| `SourceQuality` | Corroboration level enum |
| `AggregatedItem` | Single deduped news item with interaction metrics |
| `AggregatedItem.claims?` | Named entities/labels — additive field (rev 2) |
| `Cluster` | Topic cluster of related items |
| `RankedCluster` | Cluster with 5-signal score breakdown |
| `RankedCluster.references?` | Uncapped resolved `SourceRef[]` from the ranking engine (rev 3) |
| `RankedCluster.gateStatus?` | `'auto' \| 'flagged' \| 'hold'` editorial gate classification (rev 3) |
| `Top10Entry` | Ranked entry with delta from previous cycle |
| `Top10Entry.sourceDocIds?` | Full provenance `SourceDocument` ID set (rev 3) |
| `SynthesizedArticle` | Copyright-safe synthesized article |
| `SynthesizedArticle.editorialStatus?` | `'published' \| 'held' \| 'draft'` — absent = published (rev 3) |
| `SynthesizedArticle.claims?` | Per-sentence `ClaimProvenance[]` from the provenance gate (rev 3) |
| `CopyrightPolicy` | Policy constants enforcing copyright safety |
| `SourceDocument` | Fetched article metadata; body lives in the private ETL store only (rev 3) |
| `FactProvenance` | Per-source attribution for an extracted fact (rev 3) |
| `ExtractedFact` | Atomic, original-expression fact with provenance and optional quantity (rev 3) |
| `TextBlock` | Text-only render block (paragraph/heading/list/quote/callout) |
| `ChartBlock` | Chart from real `ExtractedFact.quantity` values — no invented numbers (rev 3) |
| `ImageBlock` | Image block with `MediaProvenance` — generated or openly-licensed only (rev 3) |
| `GifBlock` | GIF/animation block with `MediaProvenance` (rev 3) |
| `EmbedBlock` | Allowlisted-provider embed (rev 3) |
| `ArticleBlock` | Union of all five block types; unknown `type` → skip/fallback, never throw |
| `ClaimProvenance` | Sentence→fact mapping produced by the provenance gate (rev 3) |
| `MediaProvenance` | License/origin record for generated or openly-licensed media (rev 3) |
| `ExtractionStatus` | `'full' \| 'snippet' \| 'failed'` ETL extraction result (rev 3) |
| `AccessPolicy` | `'allowed' \| 'paywalled' \| 'robots-disallowed' \| 'tos-restricted'` (rev 3) |

---

## Versioning

Major version is locked to the `schemaVersion` major line:

| Package version | Wire `schemaVersion` | Notes |
|-----------------|---------------------|-------|
| `1.x` | `ardur-content-pipeline/v1` | Current |
| `2.x` (future) | `ardur-content-pipeline/v2` | Breaking change |

**Release cadence:**
- **Additive field** (new optional key) → `MINOR` bump + `CONTRACT_REVISION++`  
  e.g. `claims?` added → `1.1.0`, `CONTRACT_REVISION = 2`; rev 3 types → `1.2.0`, `CONTRACT_REVISION = 3`
- **Breaking change** → `MAJOR` bump + `SCHEMA_VERSION` → `v2`  
  The gate fails loud on any un-upgraded consumer.
- **Doc / no-shape change** → `PATCH` bump

**Release:** push a tag `vX.Y.Z` → CI publishes automatically.

Two reinforcing layers keep drift contained:
1. **npm semver** catches it at install/build time
2. **`assertCompatibleArtifact`** catches it at runtime

---

## Design rules

- **No PII.** No user/session/device IDs, IPs, emails, cookies, UTMs, or referrers anywhere in the contract. Interaction metrics are aggregate-only.
- **Copyright-safe.** Items carry metadata-derived hints and links only — never reproduced article bodies. Quotes must be < 25 words with attribution.
- **Additive-only evolution.** New optional fields never break older consumers; breaking changes bump the major line and fail the gate.
- **Gate before stamp.** Engines call `assertCompatibleArtifact` on inbound artifacts before casting. Re-stamping without gating launders incompatible versions silently.

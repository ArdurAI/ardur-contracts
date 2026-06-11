import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHEMA_VERSION,
  CONTRACT_REVISION,
  CYCLE_INTERVAL_MS,
  FORBIDDEN_METRIC_KEY_FRAGMENTS,
  assertCompatibleArtifact,
  SchemaVersionError,
  type ArtifactEnvelope,
  type AggregationData,
} from './index.ts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

function makeEnvelope(overrides: DeepPartial<ArtifactEnvelope<AggregationData>> = {}): unknown {
  return {
    schemaVersion: SCHEMA_VERSION,
    artifact: 'aggregation',
    runId: 'run-test-1',
    upstreamRunId: null,
    generatedAt: '2026-06-11T06:00:00.000Z',
    cycle: {
      id: '2026-06-11T06:00:00.000Z',
      windowStart: '2026-06-11T06:00:00.000Z',
      windowEnd: '2026-06-11T12:00:00.000Z',
    },
    topics: [],
    warnings: [],
    data: { itemsByTopic: {}, clustersByTopic: {}, coverageByTopic: {} },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('SCHEMA_VERSION', () => {
  it('is the correct literal string', () => {
    assert.strictEqual(SCHEMA_VERSION, 'ardur-content-pipeline/v1');
  });
});

describe('CONTRACT_REVISION', () => {
  it('is 2 (rev 2 ratifies claims[])', () => {
    assert.strictEqual(CONTRACT_REVISION, 2);
  });
});

describe('CYCLE_INTERVAL_MS', () => {
  it('is 6 hours in milliseconds', () => {
    assert.strictEqual(CYCLE_INTERVAL_MS, 6 * 60 * 60 * 1000);
  });
});

describe('FORBIDDEN_METRIC_KEY_FRAGMENTS', () => {
  it('is a non-empty readonly array of strings', () => {
    assert.ok(Array.isArray(FORBIDDEN_METRIC_KEY_FRAGMENTS));
    assert.ok(FORBIDDEN_METRIC_KEY_FRAGMENTS.length > 0);
    for (const f of FORBIDDEN_METRIC_KEY_FRAGMENTS) {
      assert.strictEqual(typeof f, 'string');
    }
  });

  it('includes key privacy-sensitive fragments', () => {
    const set = new Set(FORBIDDEN_METRIC_KEY_FRAGMENTS);
    assert.ok(set.has('email'));
    assert.ok(set.has('session'));
    assert.ok(set.has('token'));
    assert.ok(set.has('userid'));
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — happy paths
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — happy paths', () => {
  it('passes for a valid aggregation envelope', () => {
    const result = assertCompatibleArtifact(makeEnvelope(), 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
    assert.strictEqual(result.stage, 'aggregation');
    assert.strictEqual(
      (result.envelope as ArtifactEnvelope<AggregationData>).schemaVersion,
      SCHEMA_VERSION,
    );
  });

  it('passes for all four pipeline stages', () => {
    const stages = ['aggregation', 'ranking', 'top10', 'articles'] as const;
    for (const stage of stages) {
      const result = assertCompatibleArtifact(makeEnvelope({ artifact: stage }), stage);
      assert.strictEqual(result.warnings.length, 0, `stage=${stage} should have no warnings`);
      assert.strictEqual(result.stage, stage);
    }
  });

  it('passes with contractRevision === CONTRACT_REVISION (no warning)', () => {
    const result = assertCompatibleArtifact(
      makeEnvelope({ contractRevision: CONTRACT_REVISION }),
      'aggregation',
    );
    assert.strictEqual(result.warnings.length, 0);
  });

  it('passes with contractRevision < CONTRACT_REVISION (no warning)', () => {
    const result = assertCompatibleArtifact(makeEnvelope({ contractRevision: 1 }), 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
  });

  it('passes without contractRevision — treated as rev 1 (no warning)', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['contractRevision'];
    const result = assertCompatibleArtifact(env, 'aggregation');
    assert.strictEqual(result.warnings.length, 0);
  });

  it('returns envelope reference pointing to the original object', () => {
    const raw = makeEnvelope();
    const { envelope } = assertCompatibleArtifact(raw, 'aggregation');
    assert.strictEqual(envelope, raw);
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — forward-compat warning
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — forward-compat warning', () => {
  it('warns when upstream contractRevision > CONTRACT_REVISION', () => {
    const result = assertCompatibleArtifact(
      makeEnvelope({ contractRevision: CONTRACT_REVISION + 1 }),
      'aggregation',
    );
    assert.strictEqual(result.warnings.length, 1);
    const [warning] = result.warnings;
    assert.ok(warning?.includes('forward-compatible'), `warning text: "${warning}"`);
    assert.ok(warning?.includes(String(CONTRACT_REVISION + 1)));
    assert.ok(warning?.includes(String(CONTRACT_REVISION)));
  });

  it('warns and still returns a valid envelope (no throw on forward-compat)', () => {
    const result = assertCompatibleArtifact(makeEnvelope({ contractRevision: 99 }), 'aggregation');
    assert.strictEqual(result.warnings.length, 1);
    assert.ok(result.envelope !== null);
  });
});

// ---------------------------------------------------------------------------
// assertCompatibleArtifact — hard failures
// ---------------------------------------------------------------------------

describe('assertCompatibleArtifact — hard failures (SchemaVersionError)', () => {
  it('throws on null input', () => {
    assert.throws(
      () => assertCompatibleArtifact(null, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on non-object input (string)', () => {
    assert.throws(
      () => assertCompatibleArtifact('not-an-object', 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on non-object input (number)', () => {
    assert.throws(
      () => assertCompatibleArtifact(42, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on missing schemaVersion', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['schemaVersion'];
    assert.throws(
      () => assertCompatibleArtifact(env, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on wrong schemaVersion (v2)', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ schemaVersion: 'ardur-content-pipeline/v2' as typeof SCHEMA_VERSION }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws on wrong artifact stage', () => {
    assert.throws(
      () => assertCompatibleArtifact(makeEnvelope({ artifact: 'ranking' }), 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is null', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ data: null as unknown as AggregationData }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is missing', () => {
    const env = makeEnvelope() as Record<string, unknown>;
    delete env['data'];
    assert.throws(
      () => assertCompatibleArtifact(env, 'aggregation'),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });

  it('throws when data is a primitive (string)', () => {
    assert.throws(
      () =>
        assertCompatibleArtifact(
          makeEnvelope({ data: 'not-an-object' as unknown as AggregationData }),
          'aggregation',
        ),
      (err: unknown) => err instanceof SchemaVersionError,
    );
  });
});

// ---------------------------------------------------------------------------
// SchemaVersionError
// ---------------------------------------------------------------------------

describe('SchemaVersionError', () => {
  it('is an instance of Error', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 'other',
      stage: 'aggregation',
    });
    assert.ok(err instanceof Error);
    assert.ok(err instanceof SchemaVersionError);
  });

  it('has name = "SchemaVersionError"', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: null,
      stage: 'ranking',
    });
    assert.strictEqual(err.name, 'SchemaVersionError');
  });

  it('message includes stage, expected, and received', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 'ardur-content-pipeline/v2',
      stage: 'top10',
    });
    assert.ok(err.message.includes('top10'), `message: "${err.message}"`);
    assert.ok(err.message.includes(SCHEMA_VERSION), `message: "${err.message}"`);
    assert.ok(err.message.includes('v2'), `message: "${err.message}"`);
  });

  it('detail object is accessible and matches constructor args', () => {
    const err = new SchemaVersionError({
      expected: SCHEMA_VERSION,
      received: 42,
      stage: 'articles',
    });
    assert.strictEqual(err.detail.expected, SCHEMA_VERSION);
    assert.strictEqual(err.detail.received, 42);
    assert.strictEqual(err.detail.stage, 'articles');
  });

  it('is catchable as Error', () => {
    let caught: unknown;
    try {
      throw new SchemaVersionError({ expected: 'v1', received: 'v2', stage: 'ranking' });
    } catch (e) {
      caught = e;
    }
    assert.ok(caught instanceof Error);
    assert.ok(caught instanceof SchemaVersionError);
  });
});

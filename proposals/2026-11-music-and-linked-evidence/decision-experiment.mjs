// Non-normative decision experiment using synthetic results and measurements.
// This does not verify any evidence or implement a parser/resource counter.
import assert from 'node:assert/strict';

const statuses = new Set(['pass', 'fail', 'not_checked', 'unsupported', 'not_applicable']);
const isRecord = value => value !== null && typeof value === 'object'
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

function decide(required, observed) {
  assert.ok(Array.isArray(required) && required.every(x => typeof x === 'string' && x.length > 0));
  assert.equal(new Set(required).size, required.length, 'Duplicate requirements');
  assert.ok(isRecord(observed));
  for (const result of Object.values(observed)) {
    assert.ok(isRecord(result) && statuses.has(result.status), 'Unknown or malformed result');
    assert.ok(typeof result.reason === 'string' && result.reason.length > 0);
  }
  const missing = required.filter(id => !Object.hasOwn(observed, id));
  const failed = required.filter(id => observed[id]?.status === 'fail' && Object.hasOwn(observed, id));
  const incomplete = required.filter(id => !Object.hasOwn(observed, id)
    || !['pass', 'fail'].includes(observed[id].status));
  const decision = required.length === 0 ? 'not_requested' : failed.length > 0 ? 'rejected'
    : incomplete.length > 0 ? 'incomplete' : 'accepted';
  return { decision, required: [...required], observed: structuredClone(observed),
    missing: missing.map(id => ({ id, status: 'not_checked', reason: 'missing_result' })),
    failed, incomplete };
}

const defaults = Object.freeze({
  manifest_bytes: 2_097_152,
  total_manifest_bytes: 16_777_216,
  json_depth: 64,
  json_values: 100_000,
  direct_links: 64,
  work_iswcs: 128,
});

function assessCounts(measured, limits = defaults) {
  assert.ok(isRecord(measured) && isRecord(limits));
  const metrics = Object.keys(defaults).sort();
  assert.deepEqual(Object.keys(measured).sort(), metrics, 'Missing or unknown measurement');
  assert.deepEqual(Object.keys(limits).sort(), metrics, 'Missing or unknown limit');
  const exceeded = [];
  for (const metric of metrics) {
    assert.ok(Number.isSafeInteger(measured[metric]) && measured[metric] >= 0, 'Invalid measurement');
    assert.ok(Number.isSafeInteger(limits[metric]) && limits[metric] > 0, 'Invalid limit');
    if (measured[metric] > limits[metric]) exceeded.push(metric);
  }
  return { status: exceeded.length ? 'not_checked' : 'pass',
    reason: exceeded.length ? 'resource_limit' : 'within_measured_limits',
    measured: { ...measured }, limits: { ...limits }, exceeded };
}

const pass = { status: 'pass', reason: 'synthetic_pass' };
const fail = { status: 'fail', reason: 'synthetic_failure' };
const absent = { status: 'not_checked', reason: 'missing_target_file' };
const unsupported = { status: 'unsupported', reason: 'unknown_method' };
const notApplicable = { status: 'not_applicable', reason: 'not_claimed' };
const scenarios = [
  ['complete required checks', ['signature', 'link:0'], { signature: pass, 'link:0': pass }, 'accepted'],
  ['missing required result', ['signature', 'link:0'], { signature: pass }, 'incomplete'],
  ['missing second link', ['link:0', 'link:1'], { 'link:0': pass, 'link:1': absent }, 'incomplete'],
  ['unsupported second link', ['link:0', 'link:1'], { 'link:0': pass, 'link:1': unsupported }, 'incomplete'],
  ['absent required music', ['music'], { music: notApplicable }, 'incomplete'],
  ['failure with missing evidence', ['signature', 'link:0'], { signature: fail, 'link:0': absent }, 'rejected'],
  ['no requested checks', [], { signature: pass }, 'not_requested'],
  ['optional failure remains visible', ['signature'], { signature: pass, target_signature: fail }, 'accepted'],
];
const observations = scenarios.map(([name, required, observed, expected]) => {
  const before = JSON.stringify({ required, observed });
  const result = decide(required, observed);
  assert.equal(result.decision, expected, name);
  assert.deepEqual(result.observed, observed, 'Do not discard optional or incomplete results');
  assert.deepEqual(result.required, required, 'Do not shrink the application requirements');
  assert.equal(JSON.stringify({ required, observed }), before, 'Do not mutate caller input');
  return { name, decision: result.decision };
});
assert.deepEqual(decide(['signature'], {}).missing,
  [{ id: 'signature', status: 'not_checked', reason: 'missing_result' }]);
assert.deepEqual(decide(['signature', 'link:0'], { signature: fail, 'link:0': absent }).incomplete, ['link:0']);

const badReports = [
  () => decide(['signature'], { signature: { status: 'valid', reason: 'unknown_status' } }),
  () => decide(['signature'], { signature: true }),
  () => decide(['signature'], { signature: { status: 'pass' } }),
  () => decide(['signature', 'signature'], { signature: pass }),
  () => decide([''], {}),
  () => decide(['signature'], []),
];
for (const action of badReports) assert.throws(action);

let boundaryCases = 0;
for (const [metric, limit] of Object.entries(defaults)) {
  for (const [delta, expected] of [[-1, 'accepted'], [0, 'accepted'], [1, 'incomplete']]) {
    const measured = { ...defaults, [metric]: limit + delta };
    const resource = assessCounts(measured);
    const decision = decide(['resources'], { resources: resource });
    assert.equal(decision.decision, expected, `${metric} at limit ${delta < 0 ? '' : '+'}${delta}`);
    assert.deepEqual(resource.exceeded, delta > 0 ? [metric] : []);
    boundaryCases += 1;
  }
}
const badCounts = [
  () => assessCounts({ ...defaults, manifest_bytes: -1 }),
  () => assessCounts({ ...defaults, manifest_bytes: 0.5 }),
  () => assessCounts({ ...defaults, manifest_bytes: undefined }),
  () => assessCounts({ ...defaults, manifest_bytes: Number.MAX_SAFE_INTEGER + 1 }),
  () => assessCounts({ ...defaults, unexpected: 0 }),
  () => assessCounts(Object.fromEntries(Object.entries(defaults).filter(([k]) => k !== 'json_depth'))),
  () => assessCounts(defaults, { ...defaults, json_depth: 0 }),
];
for (const action of badCounts) assert.throws(action);
const report = {
  kind: 'non_normative_synthetic_decision_experiment',
  observations,
  malformed_report_cases_rejected: badReports.length,
  resource_boundary_cases: boundaryCases,
  malformed_measurement_cases_rejected: badCounts.length,
  checks: scenarios.length + badReports.length + boundaryCases + badCounts.length,
  limits: defaults,
  scope: 'Synthetic decisions and supplied counts only. No manifest parsing, measured resource enforcement, signature verification, ISWC calculation or full extension acceptance tests.',
};
process.stdout.write(JSON.stringify(report, null, 2) + '\n');

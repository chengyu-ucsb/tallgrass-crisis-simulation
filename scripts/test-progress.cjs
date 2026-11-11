'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {create} = require('../docs/progress.js');

const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../docs/content.js'), 'utf8'), context);
const stages = context.window.CRISIS_CONTENT.stages;
const reading = index => index <= 3 ? Array.from(stages[index].artifacts, artifact => artifact.id) : [];
const checks = index => Array.from(stages[index].completion.checks, check => check.id);

function satisfy(progress, index) {
  progress.markRead(reading(index));
  checks(index).forEach(id => assert.equal(progress.setCheck(index, id, true), true));
}

function finishThrough(progress, index) {
  for (let stage = 0; stage <= index; stage++) {
    satisfy(progress, stage);
    assert.equal(progress.complete(stage), true);
  }
}

test('actual case uses unique identifiers and reachable requirements for all six stages', () => {
  const stageIds = Array.from(stages, stage => stage.id);
  const artifactIds = Array.from(stages).flatMap(stage => Array.from(stage.artifacts, artifact => artifact.id));
  const checkIds = Array.from(stages).flatMap((_, index) => checks(index));
  for (const ids of [stageIds, artifactIds, checkIds]) assert.equal(new Set(ids).size, ids.length);
  assert.equal(stages.length, 6);
  assert.deepEqual(Array.from(stages, (_, index) => reading(index).length), [2, 3, 8, 8, 0, 0]);
  assert.ok(checkIds.length > 0);
});

test('fresh progress rejects future-stage operations and invalid indices', () => {
  const progress = create(stages);
  assert.equal(progress.canEnter(0), true);
  assert.equal(progress.firstIncomplete(), 0);
  for (let index = 1; index < stages.length; index++) {
    assert.equal(progress.canEnter(index), false);
    progress.markRead(reading(index));
    checks(index).forEach(id => assert.equal(progress.setCheck(index, id, true), false));
    assert.equal(progress.complete(index), false);
    assert.equal(progress.counts(index).read, 0);
  }
  for (const index of [-1, 6, 99, NaN, 1.5, '1', null, undefined]) {
    assert.equal(progress.canEnter(index), false);
    assert.equal(progress.canComplete(index), false);
    assert.equal(progress.complete(index), false);
    assert.equal(progress.setCheck(index, 'invalid', true), false);
  }
  assert.equal(progress.completedCount(), 0);
});

test('reading and every task are required, then explicit completion unlocks only the next stage', () => {
  const progress = create(stages);
  const setupChecks = checks(0);
  setupChecks.forEach(id => progress.setCheck(0, id, true));
  assert.equal(progress.canComplete(0), false, 'checked tasks cannot replace the background reading');
  progress.markRead(reading(0));
  progress.setCheck(0, setupChecks[0], false);
  assert.equal(progress.canComplete(0), false, 'reading cannot replace a required task');
  progress.setCheck(0, setupChecks[0], true);
  assert.equal(progress.canComplete(0), true);
  assert.equal(progress.canEnter(1), false, 'ready does not mean the checkpoint was completed');
  assert.equal(progress.complete(0), true);
  assert.equal(progress.canEnter(1), true);
  assert.equal(progress.canEnter(2), false);
});

test('duplicate and earlier reading cannot satisfy the next update', () => {
  const progress = create(stages);
  finishThrough(progress, 0);
  progress.markRead(reading(0));
  assert.equal(progress.counts(1).read, 0);
  const first = reading(1)[0];
  progress.markRead([first, first, 'unrecognized-artifact']);
  progress.markRead(first);
  assert.equal(progress.counts(1).read, 1);
  checks(1).forEach(id => progress.setCheck(1, id, true));
  assert.equal(progress.canComplete(1), false);
  assert.equal(progress.canEnter(2), false);
  progress.markRead(reading(1));
  assert.equal(progress.counts(1).read, 3);
  assert.equal(progress.complete(1), true);
  assert.equal(progress.counts(2).read, 0);
});

test('a JSON refresh preserves valid completed checkpoints and partial work', () => {
  const progress = create(stages);
  finishThrough(progress, 1);
  progress.markRead(reading(2).slice(0, 2));
  progress.setCheck(2, checks(2)[0], true);
  const snapshot = JSON.parse(JSON.stringify(progress.snapshot()));
  const restored = create(stages, snapshot);
  assert.deepEqual(restored.snapshot(), snapshot);
  assert.deepEqual(restored.counts(2), progress.counts(2));
  assert.equal(restored.completedCount(), 2);
  assert.equal(restored.firstIncomplete(), 2);
  assert.equal(restored.canEnter(2), true);
  assert.equal(restored.canEnter(3), false);
  assert.equal(restored.canComplete(2), false);
});

test('restoration rejects malformed, unsupported, and non-contiguous completion claims', () => {
  const futureOnly = {
    read: reading(2), checked: checks(2), completed: [stages[2].id]
  };
  for (const saved of [null, false, 12, 'invalid', [], {}, {completed: [stages[0].id]}, futureOnly]) {
    const progress = create(stages, saved);
    assert.equal(progress.completedCount(), 0);
    assert.equal(progress.firstIncomplete(), 0);
    assert.equal(progress.canEnter(1), false);
    assert.equal(progress.counts(2).read, 0);
  }

  const valid = create(stages);
  finishThrough(valid, 0);
  const saved = valid.snapshot();
  saved.completed.push(stages[2].id, 'made-up-stage');
  saved.read.push(...reading(2), 'made-up-artifact');
  saved.checked.push(...checks(2), 'made-up-task');
  const restored = create(stages, saved);
  assert.equal(restored.completedCount(), 1);
  assert.equal(restored.canEnter(1), true);
  assert.equal(restored.canEnter(2), false);
  assert.equal(restored.counts(2).read, 0);
  assert.equal(restored.isRead('made-up-artifact'), false);
  assert.equal(restored.isChecked('made-up-task'), false);
});

test('completed checkpoints remain frozen and all six stages can finish without hidden reading requirements', () => {
  const progress = create(stages);
  finishThrough(progress, 3);
  const checkpoint = progress.snapshot();
  assert.equal(progress.setCheck(0, checks(0)[0], false), false);
  assert.deepEqual(progress.snapshot(), checkpoint);
  assert.equal(progress.canEnter(4), true);
  assert.equal(progress.counts(4).documents, 0);
  for (const index of [4, 5]) {
    assert.equal(progress.canComplete(index), false);
    satisfy(progress, index);
    assert.equal(progress.complete(index), true);
  }
  assert.equal(progress.completedCount(), 6);
  assert.equal(progress.firstIncomplete(), 5);
  const restored = create(stages, JSON.parse(JSON.stringify(progress.snapshot())));
  assert.equal(restored.completedCount(), 6);
  for (let index = 0; index < stages.length; index++) assert.equal(restored.canEnter(index), true);
});

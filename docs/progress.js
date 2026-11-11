/* Completion rules shared by every entry point into the simulation. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CrisisProgress = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  function create(stages, saved = {}) {
    const read = new Set();
    const checked = new Set();
    const completed = new Set();
    const readingIds = index => index <= 3 ? stages[index].artifacts.map(item => item.id) : [];
    const checkIds = index => (stages[index].completion?.checks || []).map(item => item.id);
    const validIndex = index => Number.isInteger(index) && index >= 0 && index < stages.length;
    const canEnter = index => validIndex(index) && stages.slice(0, index).every(stage => completed.has(stage.id));
    const canComplete = index => canEnter(index) && readingIds(index).every(id => read.has(id)) && checkIds(index).every(id => checked.has(id));

    // Restore only a valid, continuous sequence. URL parameters never grant access.
    const safeSaved = saved && typeof saved === 'object' ? saved : {};
    const savedRead = new Set(Array.isArray(safeSaved.read) ? safeSaved.read : []);
    const savedChecks = new Set(Array.isArray(safeSaved.checked) ? safeSaved.checked : []);
    const savedCompleted = new Set(Array.isArray(safeSaved.completed) ? safeSaved.completed : []);
    for (let index = 0; index < stages.length && canEnter(index); index++) {
      readingIds(index).filter(id => savedRead.has(id)).forEach(id => read.add(id));
      checkIds(index).filter(id => savedChecks.has(id)).forEach(id => checked.add(id));
      if (savedCompleted.has(stages[index].id) && canComplete(index)) completed.add(stages[index].id);
    }

    return {
      canEnter,
      canComplete,
      isComplete: index => validIndex(index) && completed.has(stages[index].id),
      isRead: id => read.has(id),
      isChecked: id => checked.has(id),
      firstIncomplete: () => {
        const index = stages.findIndex(stage => !completed.has(stage.id));
        return index < 0 ? stages.length - 1 : index;
      },
      completedCount: () => completed.size,
      markRead(ids) {
        const requested = new Set(Array.isArray(ids) ? ids : [ids]);
        stages.forEach((stage, index) => {
          if (canEnter(index)) readingIds(index).filter(id => requested.has(id)).forEach(id => read.add(id));
        });
      },
      setCheck(index, id, value) {
        if (!canEnter(index) || completed.has(stages[index].id) || !checkIds(index).includes(id)) return false;
        if (value) checked.add(id);
        else checked.delete(id);
        return true;
      },
      complete(index) {
        if (!canComplete(index)) return false;
        completed.add(stages[index].id);
        return true;
      },
      counts(index) {
        if (!validIndex(index)) return {read: 0, documents: 0, checked: 0, tasks: 0, remaining: 0};
        const ids = readingIds(index);
        const checks = checkIds(index);
        const readCount = ids.filter(id => read.has(id)).length;
        const checkedCount = checks.filter(id => checked.has(id)).length;
        return {read: readCount, documents: ids.length, checked: checkedCount, tasks: checks.length, remaining: ids.length - readCount + checks.length - checkedCount};
      },
      snapshot: () => ({version: 2, read: [...read], checked: [...checked], completed: [...completed]})
    };
  }
  return {create};
});

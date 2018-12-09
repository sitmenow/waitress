const { assert } = require('chai');
const tk = require('timekeeper');

const Branch = require('../../scheduler/branch');
const Schedule = require('../../scheduler/schedule');


suite('Branch', () => {
  suite('#isOpen()', () => {

    setup(() => {
      schedule = new Schedule({
        monday: [[9, 13]],
        wednesday: [[13, 24]],
      });
      branch = new Branch({
        id: 'branch-id',
        schedule: schedule,
      });
    });

    teardown(() => {
      tk.reset();
    });

    test('returns true at a given moment marked in schedule', () => {
      const moment = new Date(Date.UTC(2018, 10, 12, 10));

      assert.isTrue(branch.isOpen(moment))
    });

    test('returns false at a given moment non-marked in schedule', () => {
      const moment = new Date(Date.UTC(2018, 10, 13, 8));

      assert.isFalse(branch.isOpen(moment))
    });

    test('returns true at the current moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 12, 10));
      tk.freeze(moment);

      assert.isTrue(branch.isOpen())
    });

    test('returns false at the current moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 13, 8));
      tk.freeze(moment);

      assert.isFalse(branch.isOpen())
    });
  });

  suite('#getShift()', () => {

    setup(() => {
      schedule = new Schedule({
        monday: [[9, 13]],
        wednesday: [[13, 24]],
      });
      branch = new Branch({
        id: 'branch-id',
        schedule: schedule,
      });
    });

    teardown(() => {
      tk.reset();
    });

    test('when the branch is open returns the shift of a given moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 12, 10));
      const [start, end] = schedule.week.monday[0];

      assert.deepEqual({ start, end }, branch.getShift(moment));
    });

    test('when the branch is not open returns undefined for a given moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 13, 8));

      assert.isUndefined(branch.getShift(moment));
    });

    test('when the branch is open returns the shift of the current moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 12, 10));
      const [start, end] = schedule.week.monday[0];
      tk.freeze(moment);

      assert.deepEqual({ start, end }, branch.getShift());
    });

    test('when the branch is not open returns undefined for the current moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 13, 8));
      tk.freeze(moment);

      assert.isUndefined(branch.getShift());
    });
  });
});

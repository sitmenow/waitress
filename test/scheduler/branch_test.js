const { assert } = require('chai');
const tk = require('timekeeper');

const Branch = require('../scheduler/branch');
const Schedule = require('../scheduler/schedule');


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

    test('returns true at the moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 12, 10));
      tk.freeze(moment);

      assert.isTrue(branch.isOpen())
    });

    test('returns false at the moment', () => {
      const moment = new Date(Date.UTC(2018, 10, 13, 8));
      tk.freeze(moment);

      assert.isFalse(branch.isOpen())
    });
  });

  suite('#getCurrentShift()', () => {});
});

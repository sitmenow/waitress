const { assert } = require('chai');
const tk = require('timekeeper');

require('./test_helper');

const errors = require('../../scheduler/errors');


suite('Branch', () => {
  setup(() => {
    brand = createBrand({
      id: 'brand-id',
      name: 'Brand Test',
    });

    branch = createBranch({
      id: 'branch-id',
      name: 'Branch Test',
      address: 'Branch Address Test #10',
      lastOpeningTime: null,
      lastClosingTime: null,
      brand,
    });
  });

  teardown(() => {
    tk.reset();
  });

  suite('#open()', () => {
    test('opens branch for first time', () => {
      const moment = new Date();
      tk.freeze(moment);

      branch.open();

      assert.isTrue(branch.isOpen());
      assert.deepEqual(moment, branch.lastOpeningTime);
      assert.isNull(branch.lastClosingTime);
    });

    test('opens branch when it is closed', () => {
      const moment = new Date();
      tk.freeze(moment);

      branch.close();
      branch.open();

      assert.isTrue(branch.isOpen());
      assert.deepEqual(moment, branch.lastOpeningTime);
      assert.isNull(branch.lastClosingTime);
    });

    test('throws error when branch is open', () => {
      branch.open();

      assert.throws(
        () => branch.open(),
        errors.BranchAlreadyOpen
      );
    });
  });

  suite('#close()', () => {
    test('closes branch for first time', () => {
      const moment = new Date();
      tk.freeze(moment);

      branch.close();

      assert.isTrue(branch.isClosed());
      assert.deepEqual(moment, branch.lastClosingTime);
      assert.isNull(branch.lastOpeningTime);
    });

    test('closes branch when it is open', () => {
      const moment = new Date();
      tk.freeze(moment);

      branch.open();
      branch.close();

      assert.isTrue(branch.isClosed());
      assert.deepEqual(moment, branch.lastClosingTime);
      assert.isNull(branch.lastOpeningTime);
    });

    test('throws error when branch is closed', () => {
      branch.close();

      assert.throws(
        () => branch.close(),
        errors.BranchAlreadyClosed
      );
    });
  });

  suite('#isOpen()', () => {
    test('returns true when branch is open', () => {
      branch.open();

      assert.isTrue(branch.isOpen());
    });

    test('returns false when branch is closed', () => {
      branch.close();

      assert.isFalse(branch.isOpen());
    });
  });

  suite('#isClosed()', () => {
    test('returns true when branch is closed', () => {
      branch.close();

      assert.isTrue(branch.isClosed());
    });

    test('returns false when branch is open', () => {
      branch.open();

      assert.isFalse(branch.isClosed());
    });
  });
});

const { assert } = require('chai');
const tk = require('timekeeper');

require('./test-helper');

const errors = require('../../lib/errors');


suite('Turn', () => {
  setup(() => {
    now = new Date();
    expectedServiceTime = new Date();
    expectedServiceTime.setSeconds(now.getSeconds() + 3600);

    branch = createBranch({
      id: 'branch-id',
      name: 'Branch Test',
    });

    customer = createCustomer({
      id: 'customer-id',
      name: 'Customer Test',
    });

    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      expectedServiceTime,
      customer,
      branch,
    });
  });

  teardown(() => {
    tk.reset();
  });

  suite('#serve()', () => {
    test('changes turn status to served if it was waiting', () => {
      assert.isTrue(turn.isWaiting());

      turn.serve();

      assert.isTrue(turn.isServed());
    });

    test('changes turn status to served if it was on hold', () => {
      turn.hold();
      assert.isTrue(turn.isOnHold());

      turn.serve();

      assert.isTrue(turn.isServed());
    });

    test('throws a turn not allowed to change status error ' +
         'if turn is not waiting nor on hold', () => {
      turn.serve();
      assert.isFalse(turn.isOnHold());
      assert.isFalse(turn.isWaiting());

      assert.throws(
        () => turn.serve(),
        errors.TurnNotAllowedToChangeStatus
      );
    });
  });

  suite('#hold()', () => {
    test('changes turn status to on hold if it was waiting', () => {
      assert.isTrue(turn.isWaiting());

      turn.hold();

      assert.isTrue(turn.isOnHold());
    });

    test('throws a turn not allowed to change status error ' +
         'if turn is not waiting', () => {
      turn.hold();
      assert.isFalse(turn.isWaiting());

      assert.throws(
        () => turn.hold(),
        errors.TurnNotAllowedToChangeStatus
      );
    });
  });

  suite('#cancel()', () => {
    test('changes turn status to canceled if it was waiting', () => {
      assert.isTrue(turn.isWaiting());

      turn.cancel();

      assert.isTrue(turn.isCanceled());
    });

    test('changes turn status to canceled if it was on hold', () => {
      turn.hold();
      assert.isTrue(turn.isOnHold());

      turn.cancel();

      assert.isTrue(turn.isCanceled());
    });

    test('throws a turn not allowed to change status error ' +
         'if turn is not waiting nor on hold', () => {
      turn.cancel();
      assert.isFalse(turn.isOnHold());
      assert.isFalse(turn.isWaiting());

      assert.throws(
        () => turn.cancel(),
        errors.TurnNotAllowedToChangeStatus
      );
    });
  });

  suite('#remove()', () => {
    test('changes turn status to removed if it was waiting', () => {
      assert.isTrue(turn.isWaiting());

      turn.remove();

      assert.isTrue(turn.isRemoved());
    });

    test('changes turn status to served if the expected service time ' +
         'is alive', () => {
      assert.isNotNull(turn.expectedServiceTime);

      turn.remove();

      assert.isTrue(turn.isRemoved());
    });

    test('throws a turn not allowed to change status error ' +
         'if it was not waiting', () => {
      turn.remove();
      assert.isFalse(turn.isWaiting());

      assert.throws(
        () => turn.remove(),
        errors.TurnNotAllowedToChangeStatus
      );
    });

    test('throws a turn not allowed to change status error ' +
         'if the expected service time has expired', () => {
      const moment = new Date(expectedServiceTime);
      moment.setSeconds(moment.getSeconds() + 10);

      tk.freeze(moment);

      assert.throws(
        () => turn.remove(),
        Error
      );
    });
  });

  suite('#reject()', () => {
    test('changes turn status to served if it was waiting', () => {
      assert.isTrue(turn.isWaiting());

      turn.reject();

      assert.isTrue(turn.isRejected());
    });

    test('changes turn status to served if it was on hold', () => {
      turn.hold();
      assert.isTrue(turn.isOnHold());

      turn.reject();

      assert.isTrue(turn.isRejected());
    });

    test('throws a turn not allowed to change status error ' +
         'if turn is not waiting nor on hold', () => {
      turn.reject();
      assert.isFalse(turn.isOnHold());
      assert.isFalse(turn.isWaiting());

      assert.throws(
        () => turn.reject(),
        errors.TurnNotAllowedToChangeStatus
      );
    });
  });

  suite('#isServed()', () => {
    test('returns true when the status is served', () => {
      turn.serve();

      assert.isTrue(turn.isServed());
    });

    test('returns false when the status is not served', () => {
      assert.isFalse(turn.isServed());
    });
  });

  suite('#isOnHold()', () => {
    test('returns true when the status is on hold', () => {
      turn.hold();

      assert.isTrue(turn.isOnHold());
    });

    test('returns false when the status is not on hold', () => {
      assert.isFalse(turn.isOnHold());
    });
  });

  suite('#isCanceled()', () => {
    test('returns true when the status is canceled', () => {
      turn.cancel();

      assert.isTrue(turn.isCanceled());
    });

    test('returns false when the status is not canceled', () => {
      assert.isFalse(turn.isCanceled());
    });
  });

  suite('#isRemoved()', () => {
    test('returns true when the status is removed', () => {
      turn.remove();

      assert.isTrue(turn.isRemoved());
    });

    test('returns false when the status is not removed', () => {
      assert.isFalse(turn.isRemoved());
    });
  });

  suite('#isRejected()', () => {
    test('returns true when the status is rejected', () => {
      turn.reject();

      assert.isTrue(turn.isRejected());
    });

    test('returns false when the status is not rejected', () => {
      assert.isFalse(turn.isRejected());
    });
  });

  suite('#isWaiting()', () => {
    test('returns true when the status is waiting', () => {
      assert.isTrue(turn.isWaiting());
    });

    test('returns false when the status is not waiting', () => {
      turn.serve();

      assert.isFalse(turn.isWaiting());
    });
  });
});

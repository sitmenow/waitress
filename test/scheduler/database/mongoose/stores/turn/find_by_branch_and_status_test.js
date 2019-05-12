const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../store_test_helper');

const TurnModel = require('../../../../../../db/mongoose/models/turn');
const errors = require('../../../../../../scheduler/database/errors');

suite('Mongoose TurnStore #findByBranchAndStatus()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModelA = createBranchModel({
      name: 'Branch Test A',
      coordinates: [324, 23],
    });
    branchModelB = createBranchModel({
      name: 'Branch Test B',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      name: 'CustomerTest',
    });

    return Promise.all(
      [branchModelA.save(), branchModelB.save(), customerModel.save()]
    );
  });

  suiteTeardown(() => {
    return Promise.all(
      [branchModelA.delete(), branchModelB.delete(), customerModel.delete()]
    );
  });

  setup(() => {
    branchA = createBranch({
      id: branchModelA.id,
    });
    branchB = createBranch({
      id: branchModelB.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });

    turnModelA = createTurnModel({
      name: 'Turn Test A',
      status: 'served',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModelA.id,
      metadata: { guests: 1 },
    });
    turnModelB = createTurnModel({
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModelB.id,
      metadata: { guests: 5 },
    });

    return Promise.all(
      [turnModelA.save(), turnModelB.save()]
    );
  });

  teardown(() => {
    sandbox.restore();

    return Promise.all(
      [turnModelA.delete(), turnModelB.delete()]
    );
  });

  test('returns the turns for the given branch id and turn status', async () => {
    const expectedTurnA = createTurn({
      id: turnModelA.id,
      name: turnModelA.name,
      status: turnModelA.status,
      requestedTime: turnModelA.requestedTime,
      expectedServiceTime: turnModelA.expectedServiceTime,
      metadata: turnModelA.metadata,
      branch: branchA,
      customer,
    });

    const turns = await database.turns.findByBranchAndStatus(
      branchModelA.id, turnModelA.status
    );

    assert.deepEqual([expectedTurnA], turns);
  });

  test('returns an empty list ' +
       'when the given branch id does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await database.turns.findByBranchAndStatus(
      nonExistentId, 'waiting'
    );

    assert.deepEqual([], turns);
  });

  test('returns an empty list ' +
       'when the given branch id has no turns for the given status', async () => {
    const turns = await database.turns.findByBranchAndStatus(
      branchModelA.id, 'waiting'
    );

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error ' +
       'when an error occurs while casting the turn model', (done) => {
    sandbox.stub(database.turns, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    database.turns.findByBranchAndStatus(branchModelA.id, turnModelA.status)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const TurnModel = require('../../../../../services/db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #findByBranchAndStatus()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    turnStore = createTurnStore();

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
    turnModelA = createTurnModel({
      name: 'Turn Test A',
      status: 'served',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModelA.id,
    });
    turnModelB = createTurnModel({
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      metadata: { guests: 5 },
      customerId: customerModel.id,
      branchId: branchModelB.id,
    });

    return Promise.all([
      branchModelA.save(),
      branchModelB.save(),
      customerModel.save(),
      turnModelA.save(),
      turnModelB.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModelA.delete(),
      branchModelB.delete(),
      customerModel.delete(),
      turnModelA.delete(),
      turnModelB.delete(),
    ]);
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
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns all the turns of the given branch id and status', async () => {
    const expectedTurnA = createTurn({
      id: turnModelA.id,
      name: turnModelA.name,
      status: turnModelA.status,
      requestedTime: turnModelA.requestedTime,
      expectedServiceTime: turnModelA.expectedServiceTime,
      metadata: turnModelA.metadata,
      customer,
      branch: branchA,
    });

    const turns = await turnStore.findByBranchAndStatus(
      branchModelA.id, turnModelA.status
    );

    assert.deepEqual([expectedTurnA], turns);
  });

  test('returns an empty list when the given branch does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await turnStore.findByBranchAndStatus(
      nonExistentId, 'waiting'
    );

    assert.deepEqual([], turns);
  });

  test('returns an empty list when the given branch has no turns for the given status', async () => {
    const turns = await turnStore.findByBranchAndStatus(
      branchModelA.id, 'waiting'
    );

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error', (done) => {
    sandbox.stub(turnStore, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    turnStore.findByBranchAndStatus(branchModelA.id, turnModelA.status)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

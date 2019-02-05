const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const TurnModel = require('../../../../../services/db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #findByBranch()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    turnStore = createTurnStore();

    branchModel = createBranchModel({
      name: 'BranchTest',
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
      branchId: branchModel.id,
    });
    turnModelB = createTurnModel({
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      metadata: { guests: 5 },
      customerId: customerModel.id,
      branchId: branchModel.id,
    });

    return Promise.all([
      branchModel.save(),
      customerModel.save(),
      turnModelA.save(),
      turnModelB.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModel.delete(),
      customerModel.delete(),
      turnModelA.delete(),
      turnModelB.delete(),
    ]);
  });

  setup(() => {
    branch = createBranch({
      id: branchModel.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns all the turns of the given branch id', async () => {
    const expectedTurnA = createTurn({
      id: turnModelA.id,
      name: turnModelA.name,
      status: turnModelA.status,
      requestedTime: turnModelA.requestedTime,
      expectedServiceTime: turnModelA.expectedServiceTime,
      metadata: turnModelA.metadata,
      customer,
      branch,
    });

    const expectedTurnB = createTurn({
      id: turnModelB.id,
      name: turnModelB.name,
      status: turnModelB.status,
      requestedTime: turnModelB.requestedTime,
      expectedServiceTime: turnModelB.expectedServiceTime,
      metadata: turnModelB.metadata,
      customer,
      branch,
    });

    const turns = await turnStore.findByBranch(branchModel.id);

    assert.deepEqual([expectedTurnA, expectedTurnB], turns);
  });

  test('returns an empty list when the given branch does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await turnStore.findByBranch(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('returns an empty list when the given branch has no turns', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await turnStore.findByBranch(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error', (done) => {
    sandbox.stub(turnStore, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    turnStore.findByBranch(branchModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

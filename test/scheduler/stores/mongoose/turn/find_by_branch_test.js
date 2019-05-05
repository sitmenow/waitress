const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../store_test_helper');

const TurnModel = require('../../../../../db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');

suite('Mongoose TurnStore #findByBranch()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModel = createBranchModel({
      name: 'BranchTest',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      name: 'CustomerTest',
    });

    return Promise.all(
      [branchModel.save(), customerModel.save()]
    );
  });

  suiteTeardown(() => {
    return Promise.all(
      [branchModel.delete(), customerModel.delete()]
    );
  });

  setup(() => {
    turnStore = createTurnStore();

    branch = createBranch({
      id: branchModel.id,
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
      branchId: branchModel.id,
      metadata: {
        product: 'Product test'
      },
    });
    turnModelB = createTurnModel({
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
      metadata: {
        guests: 5 
      },
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

  test('returns the turns for the requested branch id', async () => {
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

  test('returns an empty list ' +
       'when the given branch id does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await turnStore.findByBranch(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('returns an empty list ' +
       'when the given branch id has no turns', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await turnStore.findByBranch(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error ' +
       'when an error occurs while casting the turn model', (done) => {
    sandbox.stub(turnStore, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    turnStore.findByBranch(branchModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

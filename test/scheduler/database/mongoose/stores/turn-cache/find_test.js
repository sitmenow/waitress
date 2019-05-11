const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../store_test_helper');

const errors = require('../../../../../scheduler/stores/errors');

suite('Mongoose TurnCacheStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModel = createBranchModel({
      name: 'BranchTest',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      name: 'CustomerTest',
    });

    return Promise.all([
      branchModel.save(),
      customerModel.save()
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModel.delete(),
      customerModel.delete()
    ]);
  });

  setup(() => {
    turnCacheStore = createTurnCacheStore();

    branch = createBranch({
      id: branchModel.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });

    turnCacheModel = createTurnCacheModel({
      id: mongoose.Types.ObjectId(),
      name: 'Turn Test',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
      metadata: {
        product: 'Product test',
      },
    });

    return turnCacheModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return turnCacheModel.delete();
  });

  test('finds the turn cache for the requested id', async () => {
    const expectedTurnCache = createTurn({
      id: turnCacheModel.id,
      name: turnCacheModel.name,
      status: turnCacheModel.status,
      requestedTime: turnCacheModel.requestedTime,
      expectedServiceTime: turnCacheModel.expectedServiceTime,
      metadata: turnCacheModel.metadata,
      customer,
      branch,
    });

    const turn = await turnCacheStore.find(turnCacheModel.id);

    assert.deepEqual(expectedTurnCache, turn);
  });

  test('throws a turn cache model not found error ' +
       'when the given turn cache id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    turnCacheStore.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnCacheModelNotFound);
        done();
      });
  });

  test('throws a turn entity not created error ' +
       'when an error ocurrs while casting the turn cache model', (done) => {
    sandbox.stub(turnCacheStore, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    turnCacheStore.find(turnCacheModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

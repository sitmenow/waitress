const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../store_test_helper');

const TurnCacheModel = require('../../../../../services/db/mongoose/models/turn-cache');
const errors = require('../../../../../scheduler/stores/errors');

suite('Mongoose TurnCacheStore #remove()', () => {
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

  test('removes the turn cache for the given turn cache id', async () => {
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

    const turn = await turnCacheStore.remove(turnCacheModel.id);

    assert.deepEqual(expectedTurnCache, turn);
  });

  test('throws a turn cache model not found error ' +
       'when the given turn id does not exist', (done) => {
    turnCacheStore.remove(mongoose.Types.ObjectId())
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnCacheModelNotFound);
        done();
      });
  });

  test('throws a turn cache model not removed error ' +
       'when mongoose operation was not successful', (done) => {
    sandbox.stub(TurnCacheModel, 'deleteOne')
      .returns({ ok: 0 });

    turnCacheStore.remove(turnCacheModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnCacheModelNotRemoved);
        done();
      });
  });
});

const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  TurnCacheModelNotFound,
  TurnEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose TurnCacheStore #findByCustomer()', () => {
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
    branch = createBranch({
      id: branchModel.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });

    turnCacheModelA = createTurnCacheModel({
      id: mongoose.Types.ObjectId(),
      name: 'Turn Test A',
      status: 'served',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
      metadata: {
        product: 'Product test',
      },
    });
    turnCacheModelB = createTurnCacheModel({
      id: mongoose.Types.ObjectId(),
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
      metadata: {
        guests: 5,
      },
    });

    return Promise.all(
      [turnCacheModelA.save(), turnCacheModelB.save()]
    );
  });

  teardown(() => {
    sandbox.restore();

    return Promise.all(
      [turnCacheModelA.delete(), turnCacheModelB.delete()]
    );
  });

  test('returns the cache turns for the requested branch id', async () => {
    const expectedTurnCacheA = createTurn({
      id: turnCacheModelA.id,
      name: turnCacheModelA.name,
      status: turnCacheModelA.status,
      requestedTime: turnCacheModelA.requestedTime,
      expectedServiceTime: turnCacheModelA.expectedServiceTime,
      metadata: turnCacheModelA.metadata,
      customer,
      branch,
    });

    const expectedTurnCacheB = createTurn({
      id: turnCacheModelB.id,
      name: turnCacheModelB.name,
      status: turnCacheModelB.status,
      requestedTime: turnCacheModelB.requestedTime,
      expectedServiceTime: turnCacheModelB.expectedServiceTime,
      metadata: turnCacheModelB.metadata,
      customer,
      branch,
    });

    const turns = await database.turnsCache.findByCustomer(customerModel.id);

    assert.deepEqual([expectedTurnCacheA, expectedTurnCacheB], turns);
  });

  test('returns an empty list ' +
       'when the given customer id does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await database.turnsCache.findByCustomer(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('returns an empty list ' +
       'when the given customer id has no turns', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const turns = await database.turnsCache.findByCustomer(nonExistentId);

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error ' +
       'when an error occurs while casting the turn cache model', (done) => {
    sandbox.stub(database.turnsCache, '_modelToObject')
      .throws(new TurnEntityNotCreated());

    database.turnsCache.findByCustomer(customerModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(TurnEntityNotCreated);
        done();
      });
  });
});

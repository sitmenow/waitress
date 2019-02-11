const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #find()', () => {
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

    turnModel = createTurnModel({
      name: 'Turn Test',
      status: 'served',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
    });

    return turnModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return turnModel.delete();
  });

  test('finds the turn for the requested id', async () => {
    const expectedTurn = createTurn({
      id: turnModel.id,
      name: turnModel.name,
      status: turnModel.status,
      requestedTime: turnModel.requestedTime,
      expectedServiceTime: turnModel.expectedServiceTime,
      metadata: turnModel.metadata,
      customer,
      branch,
    });

    const turn = await turnStore.find(turnModel.id);

    assert.deepEqual(expectedTurn, turn);
  });

  test('throws a turn model not found error ' +
       'when the given id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    turnStore.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnModelNotFound);
        done();
      });
  });

  test('throws a turn entity not created error', (done) => {
    sandbox.stub(turnStore, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    turnStore.find(turnModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
        done();
      });
  });
});

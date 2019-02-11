const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const TurnModel = require('../../../../../services/db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #update()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    turnStore = createTurnStore();

    branchModel = createBranchModel({
      name: 'Branch Test',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      name: 'Customer Test',
    });
    newBranchModel = createBranchModel({
      name: 'New Branch Test',
      coordinates: [10 , 100],
    });
    newCustomerModel = createCustomerModel({
      name: 'New Customer Test',
    });

    return Promise.all([
      branchModel.save(),
      customerModel.save(),
      newBranchModel.save(),
      newCustomerModel.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModel.delete(),
      customerModel.delete(),
      newBranchModel.delete(),
      newCustomerModel.delete(),
    ]);
  });

  setup(() => {
    branch = createBranch({
      id: branchModel.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });
    newBranch = createBranch({
      id: newBranchModel.id,
    });
    newCustomer = createCustomer({
      id: newCustomerModel.id,
    });

    turnModel = createTurnModel({
      name: 'Turn Test',
      status: 'waiting',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModel.id,
    });

    return turnModel.save();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('updates turn with the given object', async () => {
    const updatedTurn = createTurn({
      id: turnModel.id,
      status: 'served',
      name: 'New Turn Test',
      requestedServiceTime: new Date(),
      expectedServiceTime: new Date(),
      customer: newCustomer,
      branch: newBranch,
      metadata: { guests: 50 },
    });

    await turnStore.update(updatedTurn);

    const storedTurn = await TurnModel.findById(turnModel.id);

    assert.equal(updatedTurn.name, storedTurn.name);
    assert.equal(updatedTurn.metadata, storedTurn.metadata);
    assert.equal(updatedTurn.status, storedTurn.status);
    assert.equal(updatedTurn.customer.id, storedTurn.customerId);
    assert.equal(updatedTurn.branch.id, storedTurn.branchId);
    assert.equal(
      updatedTurn.requestedTime.getTime(),
      storedTurn.requestedTime.getTime()
    );
    assert.equal(
      updatedTurn.expectedServiceTime.getTime(),
      storedTurn.expectedServiceTime.getTime()
    );
  });

  test('throws a turn not found error ' +
       'when the given turn does not exist', (done) => {
    const updatedTurn = createTurn({
      id: mongoose.Types.ObjectId(),
      name: 'New Turn Test',
    });

    turnStore.update(updatedTurn)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnModelNotFound);
        done();
      });
  });
});

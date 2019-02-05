const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const TurnModel = require('../../../../../services/db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #update', () => {
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

  test('updates turn with the new passed object', async () => {
    const newTurn = createTurn({
      id: turnModel.id,
      status: 'served',
      name: 'New Turn Test',
      requestedServiceTime: new Date(),
      expectedServiceTime: new Date(),
      customer: newCustomer,
      branch: newBranch,
      metadata: { guests: 50 },
    });

    await turnStore.update(newTurn);

    const storedTurn = await TurnModel.findById(turnModel.id);

    assert.equal(newTurn.name, storedTurn.name);
    assert.equal(newTurn.metadata, storedTurn.metadata);
    assert.equal(newTurn.status, storedTurn.status);
    assert.equal(newTurn.customer.id, storedTurn.customerId);
    assert.equal(newTurn.branch.id, storedTurn.branchId);
    assert.equal(
      newTurn.requestedTime.getTime(),
      storedTurn.requestedTime.getTime()
    );
    assert.equal(
      newTurn.expectedServiceTime.getTime(),
      storedTurn.expectedServiceTime.getTime()
    );
  });

  test('throws a turn not found error when the given turn does not exist', (done) => {
    const newTurn = createTurn({
      id: mongoose.Types.ObjectId(),
      name: 'New Turn Test',
    });

    turnStore.update(newTurn)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnModelNotFound);
        done();
      });
  });
});

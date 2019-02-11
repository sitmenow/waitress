const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const TurnModel = require('../../../../../services/db/mongoose/models/turn');
const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose TurnStore #create', () => {
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
    turn = createTurn({
      name: 'Turn Test',
      status: 'served',
      requestedTime: new Date(),
      expectedServiceTime: new Date(),
      metadata: { guests: 4 },
      customer,
      branch,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('creates the passed turn in DB', async () => {
    const turnId = await turnStore.create(turn);

    const storedTurn = await TurnModel.findById(turnId);

    assert.equal(turn.name, storedTurn.name);
    assert.equal(turn.status, storedTurn.status);
    assert.equal(turn.customer.id, storedTurn.customerId);
    assert.equal(turn.branch.id, storedTurn.branchId);
    assert.equal(
      turn.requestedTime.getTime(),
      storedTurn.requestedTime.getTime()
    );
    assert.equal(
      turn.expectedServiceTime.getTime(),
      storedTurn.expectedServiceTime.getTime()
    );
    assert.deepEqual(turn.metadata, storedTurn.metadata);
  });

  test('returns the id of the created model', async () => {
    const turnId = await turnStore.create(turn);

    assert.isNotNull(turnId);
  });

  test('returns a valid mongoose object id', async () => {
    const turnId = await turnStore.create(turn);

    assert.isTrue(mongoose.Types.ObjectId.isValid(turnId));
  });

  test('throws a turn model not created error', (done) => {
    sandbox.stub(turnStore, '_objectToModel')
      .throws(new errors.TurnModelNotCreated());

    turnStore.create(turn)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.TurnModelNotCreated);
        done();
      });
  });
});

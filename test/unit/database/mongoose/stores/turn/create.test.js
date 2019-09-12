const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  TurnModelNotFound,
  TurnModelNotCreated } = require('../../../../../../lib/database/errors');
const TurnModel = require('../../../../../../db/mongoose/models/turn');

suite('Mongoose TurnStore #create', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

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

  test('creates a turn model with the given turn entity', async () => {
    const turnId = await database.turns.create(turn);

    const storedTurn = await TurnModel.findById(turnId);

    assert.equal(turn.name, storedTurn.name);
    assert.equal(turn.status, storedTurn.status);
    assert.equal(turn.customer.id, storedTurn.customerId);
    assert.equal(turn.branch.id, storedTurn.branchId);
    assert.equal(turn.updatedTime, storedTurn.updatedTime);
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

  test('returns the id of the created turn model', async () => {
    const turnId = await database.turns.create(turn);

    assert.isNotNull(turnId);
  });

  test('returns a valid mongoose object id', async () => {
    const turnId = await database.turns.create(turn);

    assert.isTrue(mongoose.Types.ObjectId.isValid(turnId));
  });

  test('throws a turn model not created error ' +
       'when an error occurs while casting the turn entity', (done) => {
    sandbox.stub(database.turns, '_objectToModel')
      .throws(new TurnModelNotCreated());

    database.turns.create(turn)
      .catch((error) => {
        expect(error).to.be.instanceof(TurnModelNotCreated);
        done();
      });
  });
});

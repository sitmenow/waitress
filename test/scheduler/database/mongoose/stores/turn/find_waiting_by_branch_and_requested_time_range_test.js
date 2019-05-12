const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../store_test_helper');

const TurnModel = require('../../../../../../db/mongoose/models/turn');
const errors = require('../../../../../../scheduler/database/errors');

suite('Mongoose TurnStore #findWaitingByBranchAndRequestedTimeRange()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    baseTime = new Date();
    baseTimeSeconds = baseTime.getSeconds();

    branchModelA = createBranchModel({
      name: 'Branch Test A',
      coordinates: [324, 23],
    });
    branchModelB = createBranchModel({
      name: 'Branch Test B',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      name: 'CustomerTest',
    });

    return Promise.all([
      branchModelA.save(),
      branchModelB.save(),
      customerModel.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModelA.delete(),
      branchModelB.delete(),
      customerModel.delete(),
    ]);
  });

  setup(() => {
    branchA = createBranch({
      id: branchModelA.id,
    });
    branchB = createBranch({
      id: branchModelB.id,
    });
    customer = createCustomer({
      id: customerModel.id,
    });

    turnModelA = createTurnModel({
      name: 'Turn Test A',
      status: 'waiting',
      requestedTime: new Date(baseTime).setSeconds(baseTimeSeconds - 50),
      expectedServiceTime: new Date(),
      customerId: customerModel.id,
      branchId: branchModelA.id,
    });
    turnModelB = createTurnModel({
      name: 'Turn Test B',
      status: 'waiting',
      requestedTime: new Date(baseTime).setSeconds(baseTimeSeconds + 20),
      expectedServiceTime: new Date(),
      metadata: { guests: 5 },
      customerId: customerModel.id,
      branchId: branchModelB.id,
    });
    turnModelC = createTurnModel({
      name: 'Turn Test C',
      status: 'served',
      requestedTime: new Date(baseTime).setSeconds(baseTimeSeconds + 20),
      expectedServiceTime: new Date(),
      metadata: { guests: 5 },
      customerId: customerModel.id,
      branchId: branchModelB.id,
    });

    return Promise.all([
      turnModelA.save(),
      turnModelB.save(),
      turnModelC.save(),
    ]);
  });

  teardown(() => {
    sandbox.restore();

    return Promise.all([
      turnModelA.delete(),
      turnModelB.delete(),
      turnModelC.delete(),
    ]);
  });

  test('returns the turns with a waiting status ' +
       'for the given branch id and the turn requested time range', async () => {
    const expectedTurnB = createTurn({
      id: turnModelB.id,
      name: turnModelB.name,
      status: turnModelB.status,
      requestedTime: turnModelB.requestedTime,
      expectedServiceTime: turnModelB.expectedServiceTime,
      metadata: turnModelB.metadata,
      branch: branchB,
      customer,
    });
    const start = baseTime;
    const end = new Date(baseTime).setSeconds(baseTimeSeconds + 100)

    const turns = await database.turns.findWaitingByBranchAndRequestedTimeRange(
      branchModelB.id, start, end
    );

    assert.deepEqual([expectedTurnB], turns);
  });

  test('returns an empty list ' +
       'when the given branch id does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    const start = baseTime;
    const end = new Date(baseTime).setSeconds(baseTimeSeconds + 100)

    const turns = await database.turns.findWaitingByBranchAndRequestedTimeRange(
      nonExistentId, start, end
    );

    assert.deepEqual([], turns);
  });

  test('returns an empty list ' +
       'when the given branch id has no waiting turns at a given requested time range', async () => {
    const start = baseTime;
    const end = new Date(baseTime).setSeconds(baseTimeSeconds + 100)

    const turns = await database.turns.findWaitingByBranchAndRequestedTimeRange(
      branchModelA.id, start, end
    );

    assert.deepEqual([], turns);
  });

  test('throws a turn entity not created error ' +
       'when an error occurs while casting the turn model', (done) => {
    sandbox.stub(database.turns, '_modelToObject')
      .throws(new errors.TurnEntityNotCreated());

    const start = baseTime;
    const end = new Date(baseTime).setSeconds(baseTimeSeconds + 100)

    database.turns.findWaitingByBranchAndRequestedTimeRange(
      branchModelB.id, start, end
    ).catch((error) => {
      expect(error).to.be.instanceof(errors.TurnEntityNotCreated);
      done();
    });
  });
});

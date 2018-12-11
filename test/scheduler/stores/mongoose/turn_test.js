const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const Turn = require('../../../../scheduler/turn');
const TurnStore = require('../../../../scheduler/stores/mongoose/turn');
const TurnModel = require('../../../../services/db/mongoose/models/turn');
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const CustomerModel = require('../../../../services/db/mongoose/models/customer');
const turnStoreErrors = require('../../../../scheduler/stores/errors');


suite('Mongoose TurnStore', () => {

  setup(() => {
    turnStore = new TurnStore();
  });

  suiteSetup(() => {
    branchModel = new BranchModel({
      name: 'BranchTest',
    });
    customerModel = new CustomerModel({
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

  suite('#create()', () => {

    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      branch = new Branch({
        id: branchModel.id,
        name: branchModel.name,
      });
      customer = new Customer({
        id: customerModel.id,
        name: customerModel.name,
      });
    });

    suiteTeardown(() => {
      sandbox.restore();
    });

    setup(() => {
      turn = new Turn({
        name: 'Test',
        branch: branch,
        customer: customer,
      });
    });

    test('creates turn in DB and returns its id', async () => {
      const turnId = await turnStore.create(turn);

      assert.isNotNull(turnId);
    });

    test('throws a turn model not created error', (done) => {
      sandbox.stub(turnStore, '_objectToModel')
        .throws(new turnStoreErrors.TurnModelNotCreated());

      turnStore.create(turn)
        .catch((error) => {
          expect(error).to.be.instanceof(turnStoreErrors.TurnModelNotCreated);
          done();
        });
    });
  });

  suite('#findByBranch()', () => {

    suiteSetup(() => {
      let turn;
      let turnModel;
      let turnRequestedTime;
      const turnPromises = [];

      turnModels = [];
      expectedTurns = [];

      // Owners
      branch = new Branch({
        id: branchModel.id,
      });
      customer = new Customer({
        id: customerModel.id,
      });

      requestedTime = new Date();

      // Turn A
      turnRequestedTime = new Date(requestedTime);
      turnRequestedTime.setSeconds(turnRequestedTime.getSeconds() - 10);
      turnModel = new TurnModel({
        name: 'Turn-A',
        branchId: branch.id,
        customerId: customer.id,
        requestedTime: turnRequestedTime,
      });
      turn = new Turn({
        id: turnModel.id,
        name: turnModel.name,
        branch: branch,
        customer: customer,
        requestedTime: turnModel.requestedTime,
      });
      turnModels.push(turnModel);
      turnPromises.push(turnModel.save());

      // Turn B
      turnRequestedTime = new Date(requestedTime);
      turnRequestedTime.setSeconds(turnRequestedTime.getSeconds() + 10);
      turnModel = new TurnModel({
        name: 'Turn-B',
        branchId: branch.id,
        customerId: customer.id,
        requestedTime: turnRequestedTime,
      });
      turn = new Turn({
        id: turnModel.id,
        name: turnModel.name,
        branch: branch,
        customer: customer,
        requestedTime: turnModel.requestedTime,
      });
      turnModels.push(turnModel);
      turnPromises.push(turnModel.save());
      expectedTurns.push(turn);

      // Turn C
      turnRequestedTime = new Date(requestedTime);
      turnRequestedTime.setSeconds(turnRequestedTime.getSeconds() + 20);
      turnModel = new TurnModel({
        name: 'Turn-C',
        branchId: branch.id,
        customerId: customer.id,
        requestedTime: turnRequestedTime,
      });
      turn = new Turn({
        id: turnModel.id,
        name: turnModel.name,
        branch: branch,
        customer: customer,
        requestedTime: turnModel.requestedTime,
      });
      turnModels.push(turnModel);
      turnPromises.push(turnModel.save());
      expectedTurns.push(turn);

      return Promise.all(turnPromises);
    });

    suiteTeardown(() => {
      return Promise.all(turnModels.map(model => model.delete()));
    });

    test('returns the turns for the given branch and the given requested time', async () => {
      const turns = await turnStore.findByBranch(branch.id, requestedTime);

      assert.deepEqual(expectedTurns, turns);
    });

    test('returns an empty list for the given branch and the given requested time', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      const turns = await turnStore.findByBranch(nonExistentId, new Date());

      assert.empty(turns);
    });
  });
});

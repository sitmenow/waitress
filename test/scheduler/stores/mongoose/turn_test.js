const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const Turn = require('../../../../scheduler/turn');
const TurnStore = require('../../../../scheduler/stores/mongoose/turn');
const TurnModel = require('../../../../services/db/mongoose/models/turn');
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const CustomerModel = require('../../../../services/db/mongoose/models/customer');
const storeErrors = require('../../../../scheduler/stores/errors');


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

    test('create turn in DB and return its id', async () => {
      const turnId = await turnStore.create(turn);

      assert.isNotNull(turnId);

      const storedTurn = await TurnModel.findById(turnId);

      assert.equal(turn.name, storedTurn.name);
      assert.equal(turn.guests, storedTurn.guests);
      assert.equal(turn.status, storedTurn.status);
      assert.equal(turn.customer.id, storedTurn.customerId);
      assert.equal(turn.branch.id, storedTurn.branchId);
      assert.equal(turn.expectedServiceTime, storedTurn.expectedServiceTime);
      assert.equal(
        turn.requestedTime.getTime(),
        storedTurn.requestedTime.getTime()
      );
    });

    test('when the object cannot be converted to a model throw a turn model not created error', (done) => {
      sandbox.stub(turnStore, '_objectToModel')
        .throws(new storeErrors.TurnModelNotCreated());

      turnStore.create(turn)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.TurnModelNotCreated);
          done();
        });
    });
  });

  suite('#find()', () => {
    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      turnModel = new TurnModel({
        name: 'test',
        guests: 2,
        requestedTime: new Date(),
        customerId: customerModel.id,
        branchId: branchModel.id,
      });
      return turnModel.save();
    });

    suiteTeardown(() => {
      sandbox.restore();
      return turnModel.delete();
    });

    test('return a turn for the given id', async () => {
      const expectedTurn = new Turn({
        id: turnModel.id,
        name: turnModel.name,
        guests: turnModel.guests,
        requestedTime: turnModel.requestedTime,
        customer: new Customer({ id: customerModel.id }),
        branch: new Branch({ id: branchModel.id }),
      });

      const turn = await turnStore.find(turnModel.id);

      assert.deepEqual(expectedTurn, turn);
    });

    test('when the given id does not belong to any turn throw a turn not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      turnStore.find(nonExistentId)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.TurnNotFound);
          done();
        });
    });

    test('when the model cannot be converted to an object throw a turn not created error', (done) => {
      sandbox.stub(turnStore, '_modelToObject')
        .throws(new storeErrors.TurnNotCreated());

      turnStore.find(turnModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.TurnNotCreated);
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
      expectedTurns.push(turn);

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

    test('return the turns for the given branch and the given requested time', async () => {
      const turns = await turnStore.findByBranch(branch.id, requestedTime);

      assert.deepEqual(expectedTurns.slice(1), turns);
    });

    /*
    test('when no requested time is given return all the turns of the given branch', async() => {
      const turns = await turnStore.findByBranch(branch.id);

      assert.deepEqual(expectedTurns, turns);
    });
    */

    test('when the branch does not have turns return an empty list', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      const turns = await turnStore.findByBranch(nonExistentId, new Date());

      assert.empty(turns);
    });
  });

  suite('#update()', () => {
    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      turn = new Turn({
        name: 'test',
        guests: 2,
        branch: new Branch({ id: branchModel.id }),
        customer: new Customer({ id: customerModel.id }),
      });
      turnModel = new TurnModel({
        name: turn.name,
        guests: turn.guests,
        requestedTime: turn.requestedTime,
        customerId: turn.customer.id,
        branchId: turn.branch.id,
      });

      newBranchModel = new BranchModel({
        name: 'BranchTest',
      });
      newCustomerModel = new CustomerModel({
        name: 'CustomerTest',
      });

      return Promise.all(
        [turnModel.save(), newBranchModel.save(), newCustomerModel.save()]
      );
    });

    suiteTeardown(() => {
      sandbox.restore();
      return Promise.all(
        [turnModel.delete(), newBranchModel.delete(), newCustomerModel.delete()]
      );
    });

    test('update the given turn', async () => {
      const updatedTurn = new Turn({
        id: turnModel.id,
        status: 'served',
        name: 'update test',
        guests: 10,
        customer: new Customer({ id: newCustomerModel.id }),
        branch: new Branch({ id: newBranchModel.id }),
      });

      await turnStore.update(updatedTurn);

      const storedTurn = await TurnModel.findById(turnModel.id);

      assert.equal(updatedTurn.name, storedTurn.name);
      assert.equal(updatedTurn.guests, storedTurn.guests);
      assert.equal(updatedTurn.status, storedTurn.status);
      assert.equal(updatedTurn.customer.id, storedTurn.customerId);
      assert.equal(updatedTurn.branch.id, storedTurn.branchId);
      assert.equal(updatedTurn.expectedServiceTime, storedTurn.expectedServiceTime);
      assert.equal(
        updatedTurn.requestedTime.getTime(),
        storedTurn.requestedTime.getTime()
      );

    });

    test('when the given turn does not exist throw a turn not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();
      const updatedTurn = new Turn({
        id: nonExistentId,
        name: 'update test',
        guests: 10,
      });

      turnStore.update(updatedTurn)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.TurnNotFound);
          done();
        });
    });
  });
});

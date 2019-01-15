const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const TurnModel = require('../../../../services/db/mongoose/models/turn');
const errors = require('../../../../scheduler/stores/errors');


suite('Mongoose TurnStore', () => {
  setup(() => {
    turnStore = createTurnStore();
  });

  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModel = createBranchModel({
      branchName: 'BranchTest',
      coordinates: [324, 23],
    });
    customerModel = createCustomerModel({
      customerName: 'CustomerTest',
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
      branch = createBranch({
        branchId: branchModel.id,
        branchName: branchModel.name,
      });
      customer = createCustomer({
        customerId: customerModel.id,
        customerName: customerModel.name,
      });
    });

    setup(() => {
      turn = createTurn({
        turnName: 'Test',
        branch,
        customer,
      });
    });

    teardown(() => {
      sandbox.restore();
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
        .throws(new errors.TurnModelNotCreated());

      turnStore.create(turn)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.TurnModelNotCreated);
          done();
        });
    });
  });

  suite('#find()', () => {
    suiteSetup(() => {
      branch = createBranch({
        branchId: branchModel.id,
      });
      customer = createCustomer({
        customerId: customerModel.id,
      });

      turnModel = createTurnModel({
        turnName: 'Turn Test',
        turnGuests: 2,
        requestedTime: new Date(),
        customerId: customerModel.id,
        branchId: branchModel.id,
      });

      return turnModel.save();
    });

    suiteTeardown(() => {
      return turnModel.delete();
    });

    teardown(() => {
      sandbox.restore();
    });

    test('return a turn for the given id', async () => {
      const expectedTurn = createTurn({
        turnId: turnModel.id,
        turnName: turnModel.name,
        turnGuests: turnModel.guests,
        requestedTime: turnModel.requestedTime,
        customer,
        branch,
      });

      const turn = await turnStore.find(turnModel.id);

      assert.deepEqual(expectedTurn, turn);
    });

    test('when the given id does not belong to any turn throw a turn not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      turnStore.find(nonExistentId)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.TurnNotFound);
          done();
        });
    });

    test('when the model cannot be converted to an object throw a turn not created error', (done) => {
      sandbox.stub(turnStore, '_modelToObject')
        .throws(new errors.TurnNotCreated());

      turnStore.find(turnModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.TurnNotCreated);
          done();
        });
    });
  });

  suite('#findByBranch()', () => {
    suiteSetup(() => {
      turnModels = [];

      branch = createBranch({
        branchId: branchModel.id,
      });
      customer = createCustomer({
        customerId: customerModel.id,
      });

      baseRequestedTime = new Date();

      // Turn A
      requestedTime = new Date(baseRequestedTime);
      requestedTime.setSeconds(requestedTime.getSeconds() - 10);
      turnModels.push(
        createTurnModel({
          turnName: 'Turn Test A',
          branchId: branch.id,
          customerId: customer.id,
          requestedTime,
        })
      );

      // Turn B
      requestedTime = new Date(baseRequestedTime);
      requestedTime.setSeconds(requestedTime.getSeconds() + 10);
      turnModels.push(
        createTurnModel({
          turnName: 'Turn Test B',
          branchId: branch.id,
          customerId: customer.id,
          requestedTime,
        })
      );

      // Turn C
      requestedTime = new Date(baseRequestedTime);
      requestedTime.setSeconds(requestedTime.getSeconds() + 20);
      turnModels.push(
        createTurnModel({
          turnName: 'Turn Test C',
          branchId: branch.id,
          customerId: customer.id,
          requestedTime,
        })
      );

      return Promise.all(turnModels.map(model => model.save()));
    });

    suiteTeardown(() => {
      return Promise.all(turnModels.map(model => model.delete()));
    });

    teardown(() => {
      sandbox.restore();
    });

    test('return the turns of a branch in a given time', async () => {
      requestedTime = new Date(baseRequestedTime);
      requestedTime.setSeconds(requestedTime.getSeconds() + 10)
      const expectedTurnB = createTurn({
        turnName: 'Turn Test B',
        branch,
        customer,
        requestedTime,
      });

      requestedTime = new Date(baseRequestedTime);
      requestedTime.setSeconds(requestedTime.getSeconds() + 20)
      const expectedTurnC = createTurn({
        turnName: 'Turn Test C',
        branch,
        customer,
        requestedTime,
      });

      const [turnB, turnC] = await turnStore.findByBranch(branch.id, baseRequestedTime);

      assert.isNotNull(turnB);
      assert.equal(expectedTurnB.name, turnB.name);
      assert.equal(expectedTurnB.customer.id, turnB.customer.id);
      assert.equal(expectedTurnB.branch.id, turnB.branch.id);
      assert.equal(expectedTurnB.guests, turnB.guests);
      assert.equal(expectedTurnB.status, turnB.status);
      assert.equal(
        expectedTurnB.requestedTime.getTime(),
        turnB.requestedTime.getTime()
      );

      assert.isNotNull(turnC);
      assert.equal(expectedTurnC.name, turnC.name);
      assert.equal(expectedTurnC.customer.id, turnC.customer.id);
      assert.equal(expectedTurnC.branch.id, turnC.branch.id);
      assert.equal(
        expectedTurnC.requestedTime.getTime(),
        turnC.requestedTime.getTime()
      );

    });

    /*
    test('when no requested time is given return all the turns of the given branch', async() => {
      const turns = await turnStore.findByBranch(branch.id);

      assert.deepEqual(expectedTurns, turns);
    });
    */

    test('returns an empty list when branch has no turns', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      const turns = await turnStore.findByBranch(nonExistentId, new Date());

      assert.empty(turns);
    });
  });

  suite('#update()', () => {
    suiteSetup(() => {
      branch = createBranch({
        branchId: branchModel.id,
      });
      customer = createCustomer({
        customerId: customerModel.id,
      });

      newBranchModel = createBranchModel({
        branchName: 'New Branch Test',
      coordinates: [324, 23],
      });
      newCustomerModel = createCustomerModel({
        customerName: 'New Customer Test',
      });

      return Promise.all([
        turnModel.save(),
        newBranchModel.save(),
        newCustomerModel.save(),
      ]);
    });

    suiteTeardown(() => {
      return Promise.all([
        newBranchModel.delete(),
        newCustomerModel.delete()
      ]);
    });

    setup(() => {
      turnModel = createTurnModel({
        turnName: 'Turn Test',
        turnGuests: 12,
        customerId: customer.id,
        branchId: branch.id,
      });

      return turnModel.save();
    });

    teardown(() => {
      sandbox.restore();

      return turnModel.delete();
    });

    test('updates turn', async () => {
      const newCustomer = createCustomer({
        customerId: newCustomerModel.id,
      });
      const newBranch = createBranch({
        branchId: newBranchModel.id,
      });

      const updatedTurn = createTurn({
        turnId: turnModel.id,
        status: 'served',
        turnName: 'New Turn Test',
        turnGuests: 10,
        customer: newCustomer,
        branch: newBranch,
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
      const updatedTurn = createTurn({
        id: nonExistentId,
        name: 'New Turn Test',
        guests: 10,
      });

      turnStore.update(updatedTurn)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.TurnNotFound);
          done();
        });
    });
  });
});

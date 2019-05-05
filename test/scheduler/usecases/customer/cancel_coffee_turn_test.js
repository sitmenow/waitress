const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const coreErrors = require('../../../../scheduler/errors');
const CustomerCancelCoffeeTurn = require('../../../../scheduler/usecases/customer/cancel-coffee-turn');

suite('Use Case: Customer cancel coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerStore = createCustomerStore();
    branchStore = createBranchStore();
    turnStore = createTurnStore();
    turnCacheStore = createTurnCacheStore();

    branch = createBranch({
      id: 'branch-id',
    });
    customer = createCustomer({
      id: 'customer-id',
      name: 'Customer Test',
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch,
      customer,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns the cancelled turn', async () => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(turnCacheStore, 'remove')
      .returns(Promise.resolve(true));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    const output = await useCase.execute();

    const expectedTurn = createTurn({
      id: turn.id,
      name: turn.name,
      status: 'canceled',
      requestedTime: turn.requestedTime,
      branch,
      customer,
    });

    assert.isTrue(branchStore.find.calledWith(branch.id));
    assert.isTrue(customerStore.find.calledWith(customer.id));
    assert.isTrue(turnStore.find.calledWith(turn.id));
    assert.isTrue(turnStore.update.calledWith(expectedTurn));
    assert.isTrue(turnCacheStore.remove.calledWith(turn.id));
    assert.deepEqual(expectedTurn, output);
  });

  test('throws a turn not found error ' +
       'when the given turn model id does not exist', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnModelNotFound()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('throws a turn not updated ' +
       'when an error ocurrs while creating turn entity', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnEntityNotCreated()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a branch not found error ' +
       'when the given branch model id does not exist', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating branch entity', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchEntityNotCreated()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a customer not found error ' +
       'when the given customer model id does not exist', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerModelNotFound()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating customer entity', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerEntityNotCreated()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a branch is closed error ' +
       'when the given branch is closed at the moment', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsClosed);
        done();
      });
  });

  test('throws a turn not allowed to change status error ' +
       'when the current turn status is not waiting', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(turn, 'cancel')
      .throws(new coreErrors.TurnNotAllowedToChangeStatus());

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(coreErrors.TurnNotAllowedToChangeStatus);
        done();
      });
  });

  test('throws a turn does not belong to customer error ' +
       'when the turn does not belong to the given customer', (done) => {
    const customer = { id: 'different-customer-id' };

    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      turnStore,
      turnCacheStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnDoesNotBelongToCustomer);
        done();
      });
  });
});

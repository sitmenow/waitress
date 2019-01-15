const sinon = require('sinon');
const { expect, assert } = require('chai');
const tk = require('timekeeper');

require('../../test_helper');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const storeErrors = require('../../../../scheduler/stores/errors');
const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerUpdateTurn = require('../../../../scheduler/usecases/customer/update-turn');


suite('Use Case: Customer updates turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerStore = createCustomerStore();
    branchStore = createBranchStore();
    turnStore = createTurnStore();

    customerId = 'customer-id';
    turnId = 'turn-id';
    turnName = 'Turn Test';
    turnGuests = 6;
    restaurant = createRestaurant();
    branch = createBranch({ restaurant });
    customer = createCustomer({ customerId });
    turn = createTurn({
      turnId,
      branch,
      customer,
      turnGuests: 2,
      turnName: 'Old Turn Test',
    });
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('customer updates a turn', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);

    const expectedUpdatedTurn = createTurn({
      turnName,
      turnGuests,
      requestedTime: turn.requestedTime,
      customer: customer,
      branch: branch,
    });

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedUpdatedTurn));
    assert.isTrue(output);
  });

  test('customer udpates a turn with null name', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);

    const turnName = null;
    const expectedUpdatedTurn = createTurn({
      turnName: turn.name,
      turnGuests,
      requestedTime: turn.requestedTime,
      customer: customer,
      branch: branch,
    });

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedUpdatedTurn));
    assert.isTrue(output);
  });

  test('customer udpates a turn with empty name', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);

    const turnName = '';
    const expectedUpdatedTurn = createTurn({
      turnName: turn.name,
      turnGuests,
      requestedTime: turn.requestedTime,
      customer: customer,
      branch: branch,
    });

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedUpdatedTurn));
    assert.isTrue(output);
  });

  test('customer udpates a turn with null guests', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);

    const turnGuests = null;
    const expectedUpdatedTurn = createTurn({
      turnName,
      turnGuests: turn.guests,
      requestedTime: turn.requestedTime,
      customer: customer,
      branch: branch,
    });

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedUpdatedTurn));
    assert.isTrue(output);
  });

  test('customer updates someone else\'s turn', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));

    const customerId = 'someone-else-id';
    const otherCustomer = createCustomer({ customerId });
    const turn = createTurn({ customer: otherCustomer });

    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnDoesNotBelongToCustomer);
        done();
      });
  });

  test('customer updates a turn with non-waiting status', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(false);

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InactiveTurn);
        done();
      });
  });

  test('customer updates a turn when the branch is closed', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('non-existent customer updates a turn', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('customer updates a non-existent turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnNotFound()));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('customer updates a turn with non-existent branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('customer updates a turn but turn store throws error while updating turn', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.reject(new storeErrors.TurnNotUpdated));

    const useCase = new CustomerUpdateTurn({
      turnId,
      turnName,
      turnGuests,
      customerId,
      customerStore,
      turnStore,
      branchStore
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
    });
  });
});

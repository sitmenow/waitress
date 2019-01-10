const sinon = require('sinon');
const { expect, assert } = require('chai');
const tk = require('timekeeper');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Schedule = require('../../../../scheduler/schedule');
const Customer = require('../../../../scheduler/customer');
const BranchStore = require('../../../../scheduler/stores/branch');
const TurnStore = require('../../../../scheduler/stores/turn');
const CustomerStore = require('../../../../scheduler/stores/customer');
const storeErrors = require('../../../../scheduler/stores/errors');
const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerUpdateTurn = require('../../../../scheduler/usecases/customer/update-turn');


suite('Use Case: Customer updates turn', () => {

  setup(() => {
    sandbox = sinon.createSandbox();
    schedule = new Schedule();
    branch = new Branch({
      id: 'restaurant-branch-id',
      schedule: schedule,
    });
    customer = new Customer({
      id: 'customer-id',
    });
    turn = new Turn({
      id: 'turn-id',
      name: 'Test',
      branch: branch,
      customer: customer,
    });
    newTurn = new Turn({
      guests: 4,
      name: 'Update Test',
    });

    customerStore = new CustomerStore();
    branchStore = new BranchStore();
    turnStore = new TurnStore();
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('customer updates a turn', async () => {
    const requestedTime = new Date(Date.UTC(2018, 12, 9));
    const updatedTurn = new Turn({
      name: newTurn.name,
      guests: newTurn.guests,
      requestedTime: requestedTime,
      customer: customer,
      branch: branch,
    });

    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(updatedTurn));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(updatedTurn));
    assert.deepEqual(updatedTurn, output);
  });

  test('customer updates a turn with the same requested time', async () => {
    const newTurn = new Turn({
      guests: 4,
      name: 'Update Test',
      requestedTime: turn.requestedTime,
    });
    const updatedTurn = new Turn({
      name: newTurn.name,
      guests: newTurn.guests,
      requestedTime: newTurn.requestedTime,
      customer: customer,
      branch: branch,
    });

    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(updatedTurn));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(updatedTurn));
    assert.deepEqual(updatedTurn, output);
  });

  test('customer udpates a turn with no name', async () => {
    const requestedTime = new Date(Date.UTC(2018, 12, 9));
    const newTurn = new Turn({
      guests: 4,
    });
    const updatedTurn = new Turn({
      name: turn.name,
      guests: newTurn.guests,
      requestedTime: requestedTime,
      customer: customer,
      branch: branch,
    });

    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(updatedTurn));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(updatedTurn));
    assert.deepEqual(updatedTurn, output);
  });

  test('when the status of the turn is not waiting anymore throw a inactive turn error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(false);

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InactiveTurn);
        done();
      });
  });

  test('when the branch is not open for the new requested time', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('when the customer in the given turn does not own it throw a turn does not belong to customer error', (done) => {
    const customer = new Customer({
      id: 'new-customer-id',
    });

    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnDoesNotBelongToCustomer);
        done();
      });
  });

  test('when the given customer does not exist throw a customer not found error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('when the given turn does not exist throw a turn not found error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnNotFound()));

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('when the branch in the given turn does not exist throw a branch not found error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerUpdateTurn(
      customer, newTurn, customerStore, turnStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('when the given branch store is null throw a branch store not present error', () => {
    const branchStore = null;

    assert.throws(
      () => new CustomerUpdateTurn(
        customer, newTurn, customerStore, turnStore, branchStore
      ),
      useCaseErrors.BranchStoreNotPresent
    );
  });

  test('when the given customer store is null throw a customer store not present error', () => {
    const customerStore = null;

    assert.throws(
      () => new CustomerUpdateTurn(
        customer, newTurn, customerStore, turnStore, branchStore
      ),
      useCaseErrors.CustomerStoreNotPresent
    );
  });

  test('when the given turn store is null store throw a turn store not present error', () => {
    const turnStore = null;

    assert.throws(
      () => new CustomerUpdateTurn(
        customer, newTurn, customerStore, turnStore, branchStore
      ),
      useCaseErrors.TurnStoreNotPresent
    );
  });

  test('when the given customer is null throw a customer not present error', () => {
    const customer = null;

    assert.throws(
      () => new CustomerUpdateTurn(
        customer, newTurn, customerStore, turnStore, branchStore
      ),
      useCaseErrors.CustomerNotPresent
    );
  });

  test('when the given turn is null throw a turn not present error', () => {
    const newTurn = null;

    assert.throws(
      () => new CustomerUpdateTurn(
        customer, newTurn, customerStore, turnStore, branchStore
      ),
      useCaseErrors.TurnNotPresent
    );
  });
});

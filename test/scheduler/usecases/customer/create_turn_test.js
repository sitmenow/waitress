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
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerCreateTurn = require('../../../../scheduler/usecases/customer/create-turn');


suite('Use Case: Customer creates turn', () => {

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
      name: 'Test',
    });

    customerStore = new CustomerStore();
    branchStore = new BranchStore();
    turnStore = new TurnStore();
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('customer creates a turn', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(turn));

    const requestedTime = new Date(Date.UTC(2018, 12, 9));
    const expectedTurn = new Turn({
      name: turn.name,
      requestedTime: requestedTime,
      customer: customer,
      branch: branch,
    });
    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.deepEqual(turn, output);
  });

  test('when the given branch is not open throw a branch not open error', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('when the given branch does not exist throw a branch not found error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.BranchNotFound);
        done();
      });
  });

  test('when the given customer does not exist throw a customer not found error', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));

    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('when the given branch cannot generate an object throw a branch not created error', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
     sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotCreated()));

    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.BranchNotCreated);
        done();
      });
  });

  test('when the given customer cannot generate an object throw a customer not created error', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
     sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotCreated()));

    const useCase = new CustomerCreateTurn(
      customer, turn, branch, turnStore, customerStore, branchStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.CustomerNotCreated);
        done();
      });
  });

  test('when the given branch store is null throw a branch store not present error', () => {
    const branchStore = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.BranchStoreNotPresent
    );
  });

  test('when the given customer store is null throw a customer store not present error', () => {
    const customerStore = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.CustomerStoreNotPresent
    );
  });

  test('when the given turn store is null store throw a turn store not present error', () => {
    const turnStore = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.TurnStoreNotPresent
    );
  });

  test('when the given branch is null throw a branch not present error', () => {
    const branch = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.BranchNotPresent
    );
  });

  test('when the given customer is null throw a customer not present error', () => {
    const customer = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.CustomerNotPresent
    );
  });

  test('when the given turn is null throw a turn not present error', () => {
    const turn = null;

    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      customerUseCaseErrors.TurnNotPresent
    );
  });
});

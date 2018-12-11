const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Schedule = require('../../../../scheduler/schedule');
const Customer = require('../../../../scheduler/customer');
const BranchStore = require('../../../../scheduler/stores/branch');
const TurnStore = require('../../../../scheduler/stores/turn');
const storeErrors = require('../../../../scheduler/stores/errors');
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerListTurns = require('../../../../scheduler/usecases/customer/list-turns');


suite('Use Case: Customer lists turns', () => {

  setup(() => {
    sandbox = sinon.createSandbox();
    schedule = new Schedule();
    // TODO: Update the objects below with true data
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
    currentTurns = [turn, turn, turn];

    branchStore = new BranchStore();
    turnStore = new TurnStore();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('when the given branch is open returns its current turns', async () => {
    const index = null;
    sandbox.stub(turnStore, 'findByBranch')
      .returns(Promise.resolve(currentTurns));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'getShift')
      .returns({ start: 9, end: 18 });

    const useCase = new CustomerListTurns(
      customer, branch, index, branchStore, turnStore
    );

    const output = await useCase.execute();
    assert.deepEqual(currentTurns, output);
  });

  test('when the given branch is not open returns an emtpy list', async () => {
    const index = null;
    sandbox.stub(turnStore, 'findByBranch')
      .returns(Promise.resolve(currentTurns));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'getShift')
      .returns();

    const useCase = new CustomerListTurns(
      customer, branch, index, branchStore, turnStore
    );

    const output = await useCase.execute();
    assert.deepEqual([], output);
  });

  test('when branch model does not exist throws a restaurant branch not found error', (done) => {
    const index = null;
     sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerListTurns(
      customer, branch, index, branchStore, turnStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.BranchNotFound);
        done();
      });
  });

  test('when branch object cannot be created throws a restaurant branch not found error', (done) => {
    const index = null;
    const branchStore = new BranchStore();
     sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotCreated()));

    const useCase = new CustomerListTurns(
      customer, branch, index, branchStore, turnStore
    );

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(customerUseCaseErrors.BranchNotCreated);
        done();
      });
  });

  test('invalid branch store while creating use case', () => {
    const index = null;
    const branchStore = null;

    assert.throws(
      () => new CustomerListTurns(customer, branch, index, branchStore, turnStore),
      customerUseCaseErrors.BranchStoreNotPresent
    );
  });

  test('invalid turn store while creating use case', () => {
    const index = null;
    const turnStore = null;

    assert.throws(
      () => new CustomerListTurns(customer, branch, index, branchStore, turnStore),
      customerUseCaseErrors.TurnStoreNotPresent
    );
  });

  test('invalid branch while creating use case', () => {
    const index = null;
    const branch = null;

    assert.throws(
      () => new CustomerListTurns(customer, branch, index, branchStore, turnStore),
      customerUseCaseErrors.BranchNotPresent
    );
  });

  test('invalid customer while creating use case', () => {
    const index = null;
    const customer = null;

    assert.throws(
      () => new CustomerListTurns(customer, branch, index, branchStore, turnStore),
      customerUseCaseErrors.CustomerNotPresent
    );
  });
});

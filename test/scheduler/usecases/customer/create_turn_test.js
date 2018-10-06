const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/models/turn');
const Branch = require('../../../../scheduler/models/branch');
const Customer = require('../../../../scheduler/models/customer');
const customerErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/store/errors');
const CreateTurn = require('../../../../scheduler/usecases/customer/create-turn');
const { TurnStoreMock } = require('./mocks');


suite('Customer Create Turn', () => {

  const sandbox = sinon.createSandbox();
  const branch = new Branch({
    id: 'restaurant-branch-id',
  });
  const customer = new Customer({
    id: 'customer-id',
  });
  const turn = new Turn({
    id: 'turn-id',
    datetime: new Date(),
    active: true,
    branch: branch,
    customer: customer,
  })

  suiteSetup(() => {
  });

  suiteTeardown(() => {
    sandbox.restore();
  });

  test('created customer turn in restaurant branch', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new CreateTurn(customer.id, branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'create');
    stub.returns(turn);

    assert.deepEqual(turn, useCase.execute());
  });

  test('TurnStore.create is called once with customer and branch ids as parameters', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new CreateTurn(customer.id, branch.id, turnStore);
    sandbox.spy(turnStore, 'create');

    useCase.execute();
    assert.isTrue(turnStore.create.withArgs(customer.id, branch.id).calledOnce);
  });

  test('TurnStore.create throws a customer not found error', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new CreateTurn(customer.id, branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'create');
    stub.throws(new storeErrors.CustomerNotFound());

    assert.throws(() => useCase.execute(), customerErrors.UnableToCreateTurn);
  });

  test('TurnStore.create throws a restaurant branch not found error', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new CreateTurn(customer.id, branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'create');
    stub.throws(new storeErrors.BranchNotFound());

    assert.throws(() => useCase.execute(), customerErrors.UnableToCreateTurn);
  });

  test('TurnStore.create throws an unknown error', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new CreateTurn(customer.id, branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'create');
    stub.throws(new Error());

    assert.throws(() => useCase.execute(), customerErrors.CustomerError);
  });

  test('invalid turn store while creating use case', () => {
    assert.throws(
      () => new CreateTurn(customer.id, branch.id, null),
      customerErrors.TurnStoreNotPresent
    );
  });

  test('invalid branch id while creating use case', () => {
    const turnStore = new TurnStoreMock();

    assert.throws(
      () => new CreateTurn(customer.id, null, turnStore),
      customerErrors.BranchIDNotPresent
    );
  });

  test('invalid customer id while creating use case', () => {
    const turnStore = new TurnStoreMock();

    assert.throws(
      () => new CreateTurn(null, branch.id, turnStore),
      customerErrors.CustomerIDNotPresent
    );
  });
});

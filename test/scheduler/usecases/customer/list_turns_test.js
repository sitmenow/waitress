const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/models/turn');
const Branch = require('../../../../scheduler/models/branch');
const Customer = require('../../../../scheduler/models/customer');
const customerErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/store/errors');
const ListTurns = require('../../../../scheduler/usecases/customer/list-turns');
const { TurnStoreMock } = require('./mocks');


suite('Customer List Turns', () => {

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
  const currents = [turn, turn, turn];

  suiteSetup(() => {
  });

  suiteTeardown(() => {
    sandbox.restore();
  });

  test('current turns in a restaurant branch', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new ListTurns(branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'getCurrents');
    stub.returns(currents);

    assert.deepEqual(currents, useCase.execute());
  });

  test('TurnStore.getCurrents is called once with branch id as the only parameter', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new ListTurns(branch.id, turnStore);
    const spy = sandbox.spy(turnStore, 'getCurrents');

    useCase.execute();
    assert.isTrue(spy.withArgs(branch.id).calledOnce);
  });

  test('TurnStore.getCurrents throws a restaurant branch not found error', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new ListTurns(branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'getCurrents');
    stub.throws(new storeErrors.BranchNotFound());

    assert.throws(() => useCase.execute(), customerErrors.UnableToListTurns);
  });

  test('TurnStore.getCurrents throws an unknown error', () => {
    const turnStore = new TurnStoreMock();
    const useCase = new ListTurns(branch.id, turnStore);
    const stub = sandbox.stub(turnStore, 'getCurrents');
    stub.throws(new Error());

    assert.throws(() => useCase.execute(), customerErrors.CustomerError);
  });

  test('invalid turn store while creating use case', () => {
    assert.throws(
      () => new ListTurns(branch.id, null),
      customerErrors.TurnStoreNotPresent
    );
  });

  test('invalid branch id while creating use case', () => {
    const turnStore = new TurnStoreMock();

    assert.throws(
      () => new ListTurns(null, turnStore),
      customerErrors.BranchIDNotPresent
    );
  });
});

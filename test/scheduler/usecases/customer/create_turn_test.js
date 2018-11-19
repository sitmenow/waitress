const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerCreateTurn = require('../../../../scheduler/usecases/customer/create-turn');
const { TurnStoreMock } = require('../mocks');


suite('Use Case: Customer creates turn', () => {

  setup(() => {
    sandbox = sinon.createSandbox();
    branch = new Branch({
      id: 'restaurant-branch-id',
    });
    customer = new Customer({
      id: 'customer-id',
    });
    turn = new Turn({
      id: 'turn-id',
      datetime: new Date(),
      active: true,
      branch: branch,
      customer: customer,
    })
  });

  teardown(() => {
    sandbox.restore();
  });

  test('created customer turn in restaurant branch', () => {
    /*
    const turnStore = new TurnStoreMock();
    const useCase = new CustomerCreateTurn(customer.id, branch.id, turnStore);
    sandbox.stub(turnStore, 'create')
      .returns(turn);

    assert.deepEqual(turn, useCase.execute());
    */
  });

  test('TurnStore.create is called once with customer and branch ids as parameters', () => {
    /*
    const turnStore = new TurnStoreMock();
    const useCase = new CustomerCreateTurn(customer.id, branch.id, turnStore);
    sandbox.spy(turnStore, 'create');

    useCase.execute();
    assert.isTrue(turnStore.create.withArgs(customer.id, branch.id).calledOnce);
    */
  });

  test('TurnStore.create throws a customer not found error', () => {
    /*
    const turnStore = new TurnStoreMock();
    const useCase = new CustomerCreateTurn(customer.id, branch.id, turnStore);
    sandbox.stub(turnStore, 'create')
      .throws(new storeErrors.CustomerNotFound());

    assert.throws(
      () => useCase.execute(),
      customerUseCaseErrors.UnableToCreateTurn
    );
    */
  });

  test('TurnStore.create throws a restaurant branch not found error', () => {
  });

  test('TurnStore.create throws an unknown error', () => {
  });

  test('invalid turn store while creating use case', () => {
  });

  test('invalid branch id while creating use case', () => {
  });

  test('invalid customer id while creating use case', () => {
  });
});

const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerListTurns = require('../../../../scheduler/usecases/customer/list-turns');
const { TurnStoreMock } = require('../mocks');


suite('Use Case: Customer lists turns', () => {

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
    currents = [turn, turn, turn];
  });

  teardown(() => {
    sandbox.restore();
  });

  test('current turns in a restaurant branch', () => {
    /*
    const turnStore = new TurnStoreMock();
    const useCase = new CustomerListTurns(branch.id, turnStore);
    sandbox.stub(turnStore, 'getCurrents')
      .returns(currents);

    assert.deepEqual(currents, useCase.execute());
    */
  });

  test('TurnStore.getCurrents is called once with branch id as the only parameter', () => {
    /*
    const turnStore = new TurnStoreMock();
    const useCase = new CustomerListTurns(branch.id, turnStore);
    sandbox.spy(turnStore, 'getCurrents');

    useCase.execute();
    assert.isTrue(turnStore.getCurrents.withArgs(branch.id).calledOnce);
    */
  });

  test('TurnStore.getCurrents throws a restaurant branch not found error', () => {
  });

  test('TurnStore.getCurrents throws an unknown error', () => {
  });

  test('invalid turn store while creating use case', () => {
  });

  test('invalid branch id while creating use case', () => {
  });
});

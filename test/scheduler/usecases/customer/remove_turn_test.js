const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerRemoveTurn = require('../../../../scheduler/usecases/customer/remove-turn');
const { TurnStoreMock } = require('../mocks');


suite('Use Case: Customer removes turn', () => {

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

  test('TurnStore.remove is called once with branch id as the only parameter', () => {
  });

  test('TurnStore.remove throws a turn not found error', () => {
  });

  test('TurnStore.getCurrents throws an unknown error', () => {
  });

  test('invalid turn store while creating use case', () => {
  });

  test('invalid turn id while creating use case', () => {
  });
});

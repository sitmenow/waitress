const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const customerUseCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerRemoveTurn = require('../../../../scheduler/usecases/customer/cancel-turn');
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

});

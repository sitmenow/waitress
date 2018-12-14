const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const Hostess = require('../../../../scheduler/hostess');
const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessListTurns = require('../../../../scheduler/usecases/hostess/list-turns');
const { HostessStoreMock, TurnStoreMock } = require('../mocks');


suite('Use Case: Hostess lists turns', () => {

  setup(() => {
    sandbox = sinon.createSandbox();
    branch = new Branch({
      id: 'restaurant-branch-id',
    });
    customer = new Customer({
      id: 'customer-id',
    });
    hostess = new Hostess({
      id: 'hostess-id',
      branch: branch,
    });
    turn = new Turn({
      id: 'turn-id',
      datetime: new Date(),
      active: true,
      branch: branch,
      customer: customer,
    });
    currentTurns = [turn, turn, turn, turn];
  });

  teardown(() => {
    sandbox.restore();
  });

    /*
  test('current turns in his/her restaurant branch', () => {
    const turnStore = new TurnStoreMock();
    const hostessStore = new HostessStoreMock();
    const useCase = new HostessListTurns(hostess.id, hostessStore, turnStore);
    sandbox.stub(hostessStore, 'findById')
      .returns(hostess);
    sandbox.stub(turnStore, 'getCurrents')
      .returns(currentTurns);

    assert.deepEqual(currentTurns, useCase.execute());
  });

  test('TurnStore.getCurrents is called once with the hostess\' restaurant branch id as the only parameter', () => {
    const turnStore = new TurnStoreMock();
    const hostessStore = new HostessStoreMock();
    const useCase = new HostessListTurns(hostess.id, hostessStore, turnStore);
    const spy = sandbox.spy(turnStore, 'getCurrents');
    sandbox.stub(hostessStore, 'findById')
      .returns(hostess);

    useCase.execute();
    assert.isTrue(spy.withArgs(hostess.branch.id).calledOnce);
  });
  */

});

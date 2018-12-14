const sinon = require('sinon');
const { expect, assert } = require('chai');

const Turn = require('../../../../scheduler/turn');
const Branch = require('../../../../scheduler/branch');
const Customer = require('../../../../scheduler/customer');
const Hostess = require('../../../../scheduler/hostess');
const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessCreateTurn = require('../../../../scheduler/usecases/hostess/create-turn');
const { HostessStoreMock, TurnStoreMock, CustomerStoreMock } = require('../mocks');


suite('Use Case: Hostess creates turn', () => {

  setup(() => {
    sandbox = sinon.createSandbox();

    requested_time = new Date();
    turn = new Turn({ name: 'Customer', requested_time });
    hostess = new Hostess({ id: 'hostess-id' });

    turnStore = new TurnStoreMock();
    hostessStore = new HostessStoreMock();
    customerStore = new CustomerStoreMock();

    expectedBranch = new Branch({ id: 'restaurant-branch-id' });
    expectedCustomer = new Customer({ id: 'default-customer-id' });
    expectedHostess = new Hostess({
      id: 'hostess-id',
      branch: expectedBranch,
    });
    expectedTurn = new Turn({
      id: 'turn-id',
      name: 'Customer',
      requested_time: requested_time,
      customer: expectedCustomer,
      branch: expectedBranch,
    });
  });

  teardown(() => {
    sandbox.restore();
  });


  suite('a turn is created by the hostess', () => {
    /*
    setup(() => {
      sandbox.stub(hostessStore, 'find')
        .returns(expectedHostess);

      sandbox.stub(customerStore, 'getDefaultCustomer')
        .returns(expectedCustomer);

      sandbox.stub(turnStore, 'create')
        .returns(expectedTurn);

      useCase = new HostessCreateTurn(
        hostess,
        turn,
        hostessStore,
        turnStore,
        customerStore
      )
    });

    teardown(() => {
      sandbox.restore();
    });

    test('with a default customer as owner', () => {
      const createdTurn = useCase.execute()
      assert.deepEqual(expectedTurn.customer, createdTurn.customer);
    });

    test('with the given date', () => {
      const createdTurn = useCase.execute()
      assert.deepEqual(requested_time, createdTurn.requested_time);
    });

    test('with the hostess branch as the place', () => {
      const createdTurn = useCase.execute()
      assert.deepEqual(hostess.branch, createdTurn.branch);
    });

    test('calling HostessStore.find once', () => {
      useCase.execute();
      assert.isTrue(hostessStore.find.calledOnce);
    });

    test('calling HostessStore.find with hostess branch id as the only parameter', () => {
      useCase.execute();
      assert.isTrue(hostessStore.find.calledWith(hostess.id));
    });

    test('calling CustomerStore.getDefaultCustomer once', () => {
      useCase.execute();
      assert.isTrue(customerStore.getDefaultCustomer.calledOnce);
    });

    test('calling TurnStore.create once', () => {
      useCase.execute();
      assert.isTrue(turnStore.create.calledOnce);
    });

    test('calling TurnStore.create with a composed turn as the only parameter', () => {
      useCase.execute();
      assert.isTrue(turnStore.create.calledWith(turn));
    });
  */
  });
});

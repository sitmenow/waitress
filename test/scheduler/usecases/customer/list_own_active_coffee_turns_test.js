const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerListOwnActiveCoffeeTurns = require('../../../../scheduler/usecases/customer/list-own-active-coffee-turns');


suite('Use Case: Customer lists own active coffee turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerStore = createCustomerStore();
    turnCacheStore = createTurnCacheStore();

    customer = createCustomer({
      id: 'customer-test',
      name: 'Customer Test',
    });
    branch = createBranch({
      id: 'branch-test',
      name: 'Branch Test',
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch,
      customer,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns the current active turns for the given customer id', async () => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnCacheStore, 'findByCustomer')
      .returns(Promise.resolve([turn]));

    const useCase = new CustomerListOwnActiveCoffeeTurns({
      customerId: customer.id,
      customerStore,
      turnCacheStore,
    });

    const output = await useCase.execute();

    assert.isTrue(customerStore.find.calledWith(customer.id));
    assert.isTrue(turnCacheStore.findByCustomer.calledWith(customer.id));
    assert.deepEqual([turn], output);
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerModelNotFound()));

    const useCase = new CustomerListOwnActiveCoffeeTurns({
      customerId: customer.id,
      customerStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('throws a customer use case error ' +
       'when the customer entity cannot be created', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerEntityNotCreated()));

    const useCase = new CustomerListOwnActiveCoffeeTurns({
      customerId: customer.id,
      customerStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });

  test('throws a customer use case error ' +
       'when any of the found turn entities cannot be created', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnCacheStore, 'findByCustomer')
      .returns(Promise.reject(new storeErrors.TurnEntityNotCreated()));

    const useCase = new CustomerListOwnActiveCoffeeTurns({
      customerId: customer.id,
      customerStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });
});

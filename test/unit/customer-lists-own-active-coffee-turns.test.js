const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const useCaseErrors = require('../../lib/customer-errors');
const databaseErrors = require('../../lib/database/errors');
const CustomerListsOwnActiveCoffeeTurns = require('../../lib/customer-lists-own-active-coffee-turns');


suite('Use Case: Customer lists own active coffee turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

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
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.turnsCache, 'findByCustomer')
      .returns(Promise.resolve([turn]));

    const useCase = new CustomerListsOwnActiveCoffeeTurns({
      customerId: customer.id,
      database,
    });

    const output = await useCase.execute();

    assert.isTrue(database.customers.find.calledWith(customer.id));
    assert.isTrue(database.turnsCache.findByCustomer.calledWith(customer.id));
    assert.deepEqual([turn], output);
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerModelNotFound()));

    const useCase = new CustomerListsOwnActiveCoffeeTurns({
      customerId: customer.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('throws a customer use case error ' +
       'when the customer entity cannot be created', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerEntityNotCreated()));

    const useCase = new CustomerListsOwnActiveCoffeeTurns({
      customerId: customer.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });

  test('throws a customer use case error ' +
       'when any of the found turn entities cannot be created', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.turnsCache, 'findByCustomer')
      .returns(Promise.reject(new databaseErrors.TurnEntityNotCreated()));

    const useCase = new CustomerListsOwnActiveCoffeeTurns({
      customerId: customer.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });
});

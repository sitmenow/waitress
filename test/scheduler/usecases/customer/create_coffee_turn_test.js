const tk = require('timekeeper');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const databaseErrors = require('../../../../scheduler/database/errors');
const CustomerCreateCoffeeTurn = require('../../../../scheduler/usecases/customer/create-coffee-turn');

suite('Use Case: Customer creates coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branch = createBranch({
      id: 'branch-test',
    });
    customer = createCustomer({
      id: 'customer-id',
      name: 'Customer Test',
    });
    customerElection = 'Latte caliente';
    customerCompany = '100 Ladrillos';
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('returns the created turn', async () => {
    const moment = new Date();
    tk.freeze(moment);

    const turn = createTurn({
      name: customer.name,
      requestedTime: moment,
      metadata: {
        company: customerCompany,
        product: customerElection,
      },
      branch,
      customer,
    });

    const expectedTurn = createTurn({
      id: 'turn-id',
      name: turn.name,
      requestedTime: turn.requestedTime,
      metadata: turn.metadata,
      branch,
      customer,
    });

    sandbox.stub(database.customers, 'find').returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find').returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed').returns(false);
    sandbox.stub(database.turns, 'create').returns(Promise.resolve(expectedTurn.id));
    sandbox.stub(database.turns, 'find').returns(Promise.resolve(expectedTurn));
    sandbox.stub(database.turnsCache, 'create').returns(Promise.resolve(expectedTurn.id));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    const output = await useCase.execute();

    assert.isTrue(database.customers.find.calledWith(customer.id));
    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.turns.create.calledWith(turn));
    assert.isTrue(database.turns.find.calledWith(expectedTurn.id));
    assert.isTrue(database.turnsCache.create.calledWith(expectedTurn));
    assert.deepEqual(expectedTurn, output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.customers, 'find').returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchModelNotFound()));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('throws a turn not created error ' +
       'when an error ocurrs while creating branch entity', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchEntityNotCreated));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerModelNotFound()));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('throws a turn not created error ' +
       'when an error ocurrs while creating customer entity', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerEntityNotCreated));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
        });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });

  test('throws a branch closed error ' +
       'when the branch of its given id is closed', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsClosed);
        done();
      });
  });

  test('throws an invalid customer name error ' +
       'when the given customer name is not valid', (done) => {
    const customer = { name: null };

    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InvalidCustomerName);
        done();
      });
  });

  test('throws an invalid customer election error ' +
       'when the given customer election is not valid', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection: null,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InvalidCustomerElection);
        done();
      });
  });

  test('throws a turn not created error ' +
       'when the turn model id given to reconstruct the turn does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'create')
      .returns(Promise.resolve('turn-id'));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new databaseErrors.TurnModelNotFound()));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });

  test('throws a turn not created error ' +
       'when an error ocurrs while creating turn entity', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'create')
      .returns(Promise.resolve('turn-id'));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new databaseErrors.TurnEntityNotCreated()));

    const useCase = new CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany,
      customerElection,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });
});

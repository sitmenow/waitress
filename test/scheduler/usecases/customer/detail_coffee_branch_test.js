const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const databaseErrors = require('../../../../scheduler/database/errors');
const CustomerDetailCoffeeBranch = require('../../../../scheduler/usecases/customer/detail-coffee-branch');


suite('Use Case: Customer detail coffee branch', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerA = createCustomer({
      id: 'customer-a-test',
      name: 'Customer A Test',
    });
    customerB = createCustomer({
      id: 'customer-b-test',
      name: 'Customer B Test',
    });
    branch = createBranch({
      id: 'branch-test',
      name: 'Branch Test',
    });
    turnA = createTurn({
      id: 'turn-a-id',
      name: 'Turn A Test',
      branch,
      customer: customerA,
    });
    turnB = createTurn({
      id: 'turn-b-id',
      name: 'Turn B Test',
      branch,
      customer: customerA,
    });
    turnC = createTurn({
      id: 'turn-c-id',
      name: 'Turn C Test',
      branch,
      customer: customerB,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns a detailed status of the given branch id', async () => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customerA));
    sandbox.stub(database.turnsCache, 'findByBranch')
      .returns(Promise.resolve([turnA, turnB, turnC]));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
      database,
    });

    const expectedBranch = {
      ...branch,
      waitingTurns: 3,
      customerTurns: [turnA, turnB],
      averageWaitingTime: null,
    };

    const output = await useCase.execute();

    assert.isTrue(database.customers.find.calledWith(customerA.id));
    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.turnsCache.findByBranch.calledWith(branch.id));
    assert.deepEqual(expectedBranch, output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customerA));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchModelNotFound()));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('throws a branch use case error ' +
       'when the branch entity cannot be created', (done) => {
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customerA));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerEntityNotCreated()));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerModelNotFound()));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
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
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new databaseErrors.CustomerEntityNotCreated()));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
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
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customerA));
    sandbox.stub(database.turnsCache, 'findByBranch')
      .returns(Promise.reject(new databaseErrors.TurnEntityNotCreated()));

    const useCase = new CustomerDetailCoffeeBranch({
      customerId: customerA.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerUseCaseError);
        done();
      });
  });
});

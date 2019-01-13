const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const Branch = require('../../../../scheduler/branch');
const storeErrors = require('../../../../scheduler/stores/errors');
const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerListTurns = require('../../../../scheduler/usecases/customer/list-turns');


suite('Use Case: Customer lists turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branchStore = createBranchStore();
    turnStore = createTurnStore();
    customerStore = createCustomerStore();

    index = null;
    branchId = 'branch-id';
    customerId = 'customer-id';
    schedule = createSchedule();
    restaurant = createRestaurant();
    branch = createBranch({ branchId, restaurant, schedule });
    customer = createCustomer({ customerId });
    turn = createTurn({
      turnId: 'turn-id',
      turnName: 'Turn Test',
      branch,
      customer,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('customer list turns', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(turnStore, 'findByBranch')
      .returns(true)
    sandbox.stub(branch, 'isOpen')
      .returns(true);

    const shift = { start: 9, end: 18 };

    sandbox.stub(branch, 'getShift')
      .returns(shift);

    const useCase = new CustomerListTurns({
      index,
      customerId,
      branchId,
      branchStore,
      turnStore,
      customerStore,
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.findByBranch.calledWith(branchId, shift.start, index));
    assert.isTrue(output);
  });

  test('customer lists turns when the branch is closed', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(false);

    const useCase = new CustomerListTurns({
      index,
      customerId,
      branchId,
      branchStore,
      turnStore,
      customerStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('customer list turns but branch current shift is corrupted', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isOpen')
      .returns(true);
    sandbox.stub(branch, 'getShift')
      .returns(null);

    const useCase = new CustomerListTurns({
      index,
      customerId,
      branchId,
      branchStore,
      turnStore,
      customerStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.UnavailableBranchShift);
        done();
      });
  });

  test('customer lists turns for a non-existent branch', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerListTurns({
      index,
      customerId,
      branchId,
      branchStore,
      turnStore,
      customerStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('non-existent customer list turns', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(branch);
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));

    const useCase = new CustomerListTurns({
      index,
      customerId,
      branchId,
      branchStore,
      turnStore,
      customerStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });
});

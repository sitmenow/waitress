const sinon = require('sinon');
const { expect, assert } = require('chai');
const tk = require('timekeeper');

require('../../test_helper');

const Branch = require('../../../../scheduler/branch');
const storeErrors = require('../../../../scheduler/stores/errors');
const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const CustomerCreateTurn = require('../../../../scheduler/usecases/customer/create-turn');


suite('Use Case: Customer creates turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerStore = createCustomerStore();
    branchStore = createBranchStore();
    turnStore = createTurnStore();

    customerId = 'customer-id';
    customerName = 'Customer Test';
    turnName = 'Turn Test';
    turnGuests = 11;
    branchId = 'branch-id';
    restaurant = createRestaurant();
    branch = createBranch({ branchId, restaurant });
    customer = createCustomer({ customerId, customerName });
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('customer creates a turn', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(true));

    const requestedTime = new Date();
    const expectedTurn = createTurn({
      turnName,
      turnGuests,
      requestedTime,
      branch,
      customer,
    });
    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.isTrue(output);
  });

  test('customer creates a turn with null turn name', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(true));

    const turnName = null;
    const requestedTime = new Date();
    const expectedTurn = createTurn({
      turnName: customer.name,
      turnGuests,
      requestedTime,
      branch,
      customer,
    });
    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.isTrue(output);
  });

  test('customer creates a turn with empty turn name', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(true));

    const turnName = '';
    const requestedTime = new Date();
    const expectedTurn = createTurn({
      turnName: customer.name,
      turnGuests,
      requestedTime,
      branch,
      customer,
    });
    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.isTrue(output);
  });

  test('customer creates a turn when the branch is closed', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('customer creates a turn for a non-existent branch', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('non-existent customer creates turn', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotFound);
        done();
      });
  });

  test('customer creates a turn but branch store cannot create found branch', (done) => {
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
     sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotCreated()));

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotCreated);
        done();
      });
  });

  test('customer creates a turn but customer store cannot create found customer', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
     sandbox.stub(customerStore, 'find')
      .returns(Promise.reject(new storeErrors.CustomerNotCreated()));

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.CustomerNotCreated);
        done();
      });
  });

  test('customer creates a turn but turn store cannot create new turn', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(customerStore, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.reject(new storeErrors.TurnNotCreated()));

    const useCase = new CustomerCreateTurn({
      customerId,
      turnName,
      turnGuests,
      branchId,
      turnStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });
    /*
    assert.throws(
      () => new CustomerCreateTurn(
        customer, turn, branch, turnStore, customerStore, branchStore
      ),
      useCaseErrors.TurnNotPresent
    );
    */
});

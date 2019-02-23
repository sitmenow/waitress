const sinon = require('sinon');
const { expect, assert } = require('chai');
const mongoose = require('mongoose');
const tk = require('timekeeper');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerCreateCoffeeTurn = require('../../../../scheduler/usecases/customer/create-coffee-turn');


suite('Use Case: Customer creates coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branchStore = createBranchStore();
    turnStore = createTurnStore();

    customerCompany = '100 Ladrillos';
    customerElection = 'Latte doble carga deslactosado';
    branch = createBranch({
      id: 'Branch Test',
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch,
    });
    customer = createCustomer({
      id: 'customer-id',
      name: 'Customer Test',
    });
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('customer creates coffee turn', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(turn.id));
    sandbox.stub(mongoose.Types, 'ObjectId')
      .returns(customer.id);

    const moment = new Date();
    tk.freeze(moment);

    const useCase = new CustomerCreateCoffeeTurn({
      customerName: customer.name,
      branchId: branch.id,
      customerCompany,
      customerElection,
      branchStore,
      turnStore,
    });

    const output = await useCase.execute();

    const expectedTurn = createTurn({
      branch,
      customer,
      name: customer.name,
      requestedTime: moment,
      metadata: {
        company: customerCompany,
        election: customerElection,
      },
    });

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.deepEqual(turn.id, output);
  });

  test('customer creates customer turn for a non-existent branch', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new CustomerCreateCoffeeTurn({
      customerName: customer.name,
      branchId: branch.id,
      customerCompany,
      customerElection,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('when the branch is closed', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(false);

    const useCase = new CustomerCreateCoffeeTurn({
      customerName: customer.name,
      branchId: branch.id,
      customerCompany,
      customerElection,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsClosed);
        done();
      });
  });

  test('when the customer name is invalid', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);

    const useCase = new CustomerCreateCoffeeTurn({
      customerName: null,
      branchId: branch.id,
      customerCompany,
      customerElection,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InvalidCustomerName);
        done();
      });
  });

  test('when the customer election is invalid', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);

    const customerElection = null;

    const useCase = new CustomerCreateCoffeeTurn({
      customerName: customer.name,
      branchId: branch.id,
      customerCompany,
      customerElection,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.InvalidCustomerElection);
        done();
      });
  });
});

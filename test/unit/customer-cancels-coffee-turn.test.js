const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const {
  TurnModelNotFound,
  TurnEntityNotCreated,
  BranchModelNotFound,
  BranchEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated } = require('../../lib/database/errors');
const {
  TurnNotFound,
  BranchNotFound,
  CustomerNotFound,
  CorruptedTurn,
  CorruptedBranch,
  CorruptedCustomer,
  BranchNotAvailable,
  TurnNotAllowedToChangeStatus } = require('../../lib/errors');
const CustomerCancelsCoffeeTurn = require('../../lib/customer-cancels-coffee-turn');

suite('Use Case: Customer cancels coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branch = createBranch({
      id: 'branch-id',
    });
    customer = createCustomer({
      id: 'customer-id',
      name: 'Customer Test',
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

  test('returns the cancelled turn', async () => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'update')
      .returns(Promise.resolve(true));
    sandbox.stub(database.turnsCache, 'remove')
      .returns(Promise.resolve(true));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    const output = await useCase.execute();

    const expectedTurn = createTurn({
      id: turn.id,
      name: turn.name,
      status: 'canceled',
      requestedTime: turn.requestedTime,
      branch,
      customer,
    });

    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.customers.find.calledWith(customer.id));
    assert.isTrue(database.turns.find.calledWith(turn.id));
    assert.isTrue(database.turns.update.calledWith(expectedTurn));
    assert.isTrue(database.turnsCache.remove.calledWith(turn.id));
    assert.deepEqual(expectedTurn, output);
  });

  test('throws a turn not found error ' +
       'when the given turn model id does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new TurnModelNotFound()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotFound);
        done();
      });
  });

  test('throws a turn not updated ' +
       'when an error ocurrs while creating turn entity', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new TurnEntityNotCreated()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedTurn);
        done();
      });
  });

  test('throws a branch not found error ' +
       'when the given branch model id does not exist', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchModelNotFound()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating branch entity', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchEntityNotCreated()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedBranch);
        done();
      });
  });

  test('throws a customer not found error ' +
       'when the given customer model id does not exist', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new CustomerModelNotFound()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CustomerNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating customer entity', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.reject(new CustomerEntityNotCreated()));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedCustomer);
        done();
      });
  });

  test('throws a branch is closed error ' +
       'when the given branch is closed at the moment', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotAvailable);
        done();
      });
  });

  test('throws a turn not allowed to change status error ' +
       'when the current turn status is not waiting', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(turn, 'cancel')
      .throws(new TurnNotAllowedToChangeStatus());

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotAllowedToChangeStatus);
        done();
      });
  });

  test('throws a turn does not belong to customer error ' +
       'when the turn does not belong to the given customer', (done) => {
    const customer = { id: 'different-customer-id' };

    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'find')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerCancelsCoffeeTurn({
      turnId: turn.id,
      customerId: customer.id,
      branchId: branch.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotFound);
        done();
      });
  });
});

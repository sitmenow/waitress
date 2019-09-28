const tk = require('timekeeper');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect, assert } = require('chai');

require('./test-helper');

const {
  TurnNotFound,
  BranchNotFound,
  CustomerNotFound,
  UserNotFound,
  BranchNotAvailable,
  CorruptedTurn,
  CorruptedBranch,
  CorruptedUser,
  CorruptedCustomer,
  InvalidTurn } = require('../../lib/errors');
const {
  UserModelNotFound,
  UserEntityNotCreated,
  TurnModelNotFound,
  BranchModelNotFound,
  CustomerModelNotFound,
  TurnEntityNotCreated,
  BranchEntityNotCreated,
  CustomerEntityNotCreated } = require('../../lib/database/errors');
const CustomerCreatesCoffeeTurn = require('../../lib/customer-creates-coffee-turn');


suite('Use Case: Customer creates coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branch = createBranch({
      id: 'branch-test',
    });
    user = createUser({
      id: 'user-id',
      name: 'User Test',
    });
    customer = createCustomer({
      id: 'customer-id',
      user,
    });
    product = 'Latte caliente';
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('returns the created turn', async () => {
    const moment = new Date();
    tk.freeze(moment);

    const turn = createTurn({
      name: user.name,
      requestedTime: moment,
      metadata: {
        product,
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

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(expectedTurn));
    sandbox.stub(database.turns, 'create')
      .returns(Promise.resolve('turn-id'));
    sandbox.stub(database.turnsCache, 'create')
      .returns(Promise.resolve(null));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      product,
      branchId: branch.id,
      database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(user.id)).to.be.true;
    expect(database.customers.findByUserId.calledWith(user.id)).to.be.true;
    expect(database.branches.find.calledWith(branch.id)).to.be.true;
    expect(database.turns.create.calledWith(turn)).to.be.true;
    expect(database.turnsCache.create.calledWith(expectedTurn)).to.be.true;
    expect(output).deep.equal(expectedTurn);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchModelNotFound()));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('throws a corrupted branch error ' +
       'when an error ocurrs while creating branch entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchEntityNotCreated()));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedBranch);
        done();
      });
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.reject(new CustomerModelNotFound()));

    const useCase = new CustomerCreatesCoffeeTurn({
      userrId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CustomerNotFound);
        done();
      });
  });

  test('throws a user model not found error ' +
       'when the given user id does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));

    const useCase = new CustomerCreatesCoffeeTurn({
      userrId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UserNotFound);
        done();
      });
  });

  test('throws a corrupted user error ' +
       'when an error ocurrs while creating user entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserEntityNotCreated));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedUser);
        done();
      });
  });

  test('throws a corrupted branch error ' +
       'when an error ocurrs while creating branch entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchEntityNotCreated()));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedBranch);
        done();
      });
  });

  test('throws a corrupted customer error ' +
       'when an error ocurrs while creating customer entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.reject(new CustomerEntityNotCreated()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedCustomer);
        done();
      });
  });

  test('throws a branch not available error ' +
       'when the given branch is closed', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotAvailable);
        done();
      });
  });

  test('throws an invalid turn name error ' +
       'when the user name is not valid', (done) => {
    const user = { name: null };

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(InvalidTurn);
        done();
      });
  });

  test('throws an invalid product error ' +
       'when the given product is not valid', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product: null,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(InvalidTurn);
        done();
      });
  });

  test('throws a turn model not found error ' +
       'when the turn model id given to reconstruct the turn does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'create')
      .returns(Promise.resolve('turn-id'));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new TurnModelNotFound()));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotFound);
        done();
      });
  });

  test('throws a corrupted turn created error ' +
       'when an error ocurrs while creating turn entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'create')
      .returns(Promise.resolve('turn-id'));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new TurnEntityNotCreated()));

    const useCase = new CustomerCreatesCoffeeTurn({
      userId: user.id,
      branchId: branch.id,
      product,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedTurn);
        done();
      });
  });
});

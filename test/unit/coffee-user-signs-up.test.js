const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect, assert } = require('chai');

require('./test-helper');

const {
  InvalidUser,
  UserExists,
  CorruptedUser } = require('../../lib/errors');
const {
  UserModelNotFound,
  UserModelNotCreated,
  UserEntityNotCreated,
  CustomerModelNotCreated } = require('../../lib/database/errors');
const CoffeeUserSignsUp = require('../../lib/coffee-user-signs-up');


suite('Use Case: Coffee user signs up', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  setup(() => {
    userId = 'user-id';
    username = 'User Test';
    email = 'user@example.com';
    picture = 'https://example.com/user/picture';
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns the created user', async () => {
    const user = createUser({
      id: userId,
      name: username,
      email,
      picture,
    });
    const customer = createCustomer({ user });

    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));
    sandbox.stub(database.users, 'create')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'create')
      .returns(Promise.resolve(customer));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(user.id)).to.be.true;
    expect(database.users.create.calledWith(user)).to.be.true;
    expect(database.customers.create.calledWith(customer)).to.be.true;
    expect(output).deep.equal(user);
  });

  test('throws an invalid user error ' +
       'when the given user id is empty', (done) => {
    const userId = '';
    const user = createUser({
      id: userId,
      name: username,
      email,
      picture,
    });

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(InvalidUser);
        done();
      });
  });

  test('throws an invalid user error ' +
       'when the given user name is empty', (done) => {
    const username = '';
    const user = createUser({
      id: userId,
      name: username,
      email,
      picture,
    });

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(InvalidUser);
        done();
      });
  });

  test('throws a user exists error ' +
       'when the given user id belongs to a user', (done) => {
    const user = createUser({
      id: userId,
      name: username,
      email,
      picture,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UserExists);
        done();
      });
  });

  test('throws a corrupted user error ' +
       'when an error occurrs while creating user entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserEntityNotCreated()));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedUser);
        done();
      });
  });

  test('throws an unknown error ' +
       'when an error occurrs while finding the user of the given id', (done) => {
    class UnknownError extends Error {}

    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UnknownError()));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UnknownError);
        done();
      });
  });

  test('throws an unknown error ' +
       'when an error occurrs while creating the user model', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));
    sandbox.stub(database.users, 'create')
      .returns(Promise.reject(new UserModelNotCreated()));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(Error);
        expect(error.message).equal('DB: User not created');
        done();
      });
  });

  test('throws an unknown error ' +
       'when an error occurrs while creating the customer model', (done) => {
    const user = createUser({
      id: userId,
      name: username,
      email,
      picture,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));
    sandbox.stub(database.users, 'create')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'create')
      .returns(Promise.reject(new CustomerModelNotCreated()));

    const useCase = new CoffeeUserSignsUp({
      userId, username, email, picture, database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(Error);
        expect(error.message).equal('DB: Customer not created');
        done();
      });
  });
});

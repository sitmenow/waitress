const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect, assert } = require('chai');

require('./test-helper');

const {
  UserNotFound,
  CorruptedUser } = require('../../lib/errors');
const {
  AdminModelNotFound,
  UserModelNotFound,
  UserEntityNotCreated } = require('../../lib/database/errors');
const CoffeeUserDetailsUser = require('../../lib/coffee-user-details-user');


suite('Use Case: Coffee user details user', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  setup(() => {
    userId = 'user-id';
    requestedUserId = 'requested-user-id';
  });

  teardown(() => {
    sandbox.restore();
  });

  test('if the user details himself/herself returns his/her data', async () => {
    requestedUserId = 'user-id';

    const user = createUser({
      id: userId,
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));

    const useCase = new CoffeeUserDetailsUser({
      userId,
      requestedUserId,
      database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(userId)).to.be.true;
    expect(output).deep.equal(user);
  });

  test('if the user is an admin returns the requested user', async () => {
    const user = createUser({
      id: userId,
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.resolve(admin));

    const useCase = new CoffeeUserDetailsUser({
      userId,
      requestedUserId,
      database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(userId)).to.be.true;
    expect(database.admins.findByUserId.calledWith(userId)).to.be.true;
    expect(output).deep.equal(user);
  });

  test('throws an user not found error ' +
       'when the user requesting is not an admin', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.reject(new AdminModelNotFound()));

    const useCase = new CoffeeUserDetailsUser({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UserNotFound);
        done();
      });
  });

  test('throws a user not found error ' +
       'when the user requesting does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));

    const useCase = new CoffeeUserDetailsUser({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UserNotFound);
        done();
      });
  });

  test('throws a corrupted user error ' +
       'when an error ocurrs while creating the user entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserEntityNotCreated()));

    const useCase = new CoffeeUserDetailsUser({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedUser);
        done();
      });
  });
});

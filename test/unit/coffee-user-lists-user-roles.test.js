const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect, assert } = require('chai');

require('./test-helper');

const {
  UserNotFound,
  CorruptedUser,
  CorruptedAdmin,
  HostessNotFound,
  CorruptedHostess,
  CustomerNotFound,
  CorruptedCustomer } = require('../../lib/errors');
const {
  UserModelNotFound,
  UserEntityNotCreated,
  AdminModelNotFound,
  AdminEntityNotCreated,
  HostessModelNotFound,
  HostessEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated } = require('../../lib/database/errors');
const CoffeeUserListsUserRoles = require('../../lib/coffee-user-lists-user-roles');


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

  test('if the user requests his/her roles returns his/her roles', async () => {
    requestedUserId = 'user-id';

    const user = createUser({
      id: userId,
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const customer = createCustomer({
      id: 'customer-id',
      user,
    });
    const hostess = createHostess({
      id: 'hostess-id',
      user,
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(customer));
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.resolve(admin));

    const expectedRoles = [
      customer, hostess, admin,
    ];

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(userId)).to.be.true;
    expect(database.customers.findByUserId.calledWith(userId)).to.be.true;
    expect(database.hostesses.findByUserId.calledWith(userId)).to.be.true;
    expect(database.admins.findByUserId.calledWith(userId)).to.be.true;
    expect(output).deep.equal(expectedRoles);
  });

  test('if the requesting user is an admin returns the requested roles', async () => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });
    const requestedUser = createUser({
      id: requestedUserId,
      name: 'Requested User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });
    const requestedCustomer = createCustomer({
      id: 'requested-customer-id',
      user: requestedUser,
    });
    const requestedHostess = createHostess({
      id: 'hostess-id',
      user: requestedUser,
    });
    const requestedAdmin = createAdmin({
      id: 'requested-admin-id',
      user: requestedUser,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .onCall(0)
      .returns(Promise.resolve(admin))
      .onCall(1)
      .returns(Promise.resolve(requestedAdmin));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(requestedCustomer));
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(requestedHostess));

    const expectedRoles = [
      requestedCustomer, requestedHostess, requestedAdmin,
    ];

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    const output = await useCase.execute();

    expect(database.users.find.calledWith(userId)).to.be.true;
    expect(database.admins.findByUserId.calledWith(userId)).to.be.true
    expect(database.customers.findByUserId.calledWith(requestedUserId)).to.be.true;
    expect(database.hostesses.findByUserId.calledWith(requestedUserId)).to.be.true;
    expect(database.admins.findByUserId.calledWith(requestedUserId)).to.be.true;
    expect(output).deep.equal(expectedRoles);
  });

  test('throws a user not found error ' +
       'when the requesting user is not an admin', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.reject(new AdminModelNotFound()));

    const useCase = new CoffeeUserListsUserRoles({
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

  test('throws an user not found error ' +
       'when the requesting user does not exist', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserModelNotFound()));

    const useCase = new CoffeeUserListsUserRoles({
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

  test('throws a corrupted user error' +
       'when an error occurrs while creating user entity', (done) => {
    sandbox.stub(database.users, 'find')
      .returns(Promise.reject(new UserEntityNotCreated()));

    const useCase = new CoffeeUserListsUserRoles({
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

  test('throws a corrupted admin error ' +
       'when an error occurrs while creating admin entity at admin verification', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.reject(new AdminEntityNotCreated()));

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedAdmin);
        done();
      });
  });

  test('throws a corrupted customer error ' +
       'when an error occurs while creating the customer entity', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });
    const requestedUser = createUser({
      id: requestedUserId,
      name: 'Requested User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const requestedCustomer = createCustomer({
      id: 'requested-customer-id',
      user: requestedUser,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.resolve(admin));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.reject(new CustomerEntityNotCreated()));

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedCustomer);
        done();
      });
  });

  test('throws a corrupted admin error ' +
       'when an error occurs while creating the admin entity', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });
    const requestedUser = createUser({
      id: requestedUserId,
      name: 'Requested User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const requestedCustomer = createCustomer({
      id: 'requested-customer-id',
      user: requestedUser,
    });
    const requestedHostess = createHostess({
      id: 'requested-hostess-id',
      user: requestedUser,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .onCall(0)
      .returns(Promise.resolve(admin))
      .onCall(1)
      .returns(Promise.reject(new AdminEntityNotCreated()));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(requestedCustomer));
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(requestedHostess));

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedAdmin);
        done();
      });
  });

  test('throws a corrupted hostess error ' +
       'when an error occurs while creating the hostess entity', (done) => {
    const user = createUser({
      id: userId,
      name: 'User Admin Test',
      email: 'user-admin@example.com',
      picture: 'https://example.com/user-admin/picture',
    });
    const admin = createAdmin({
      id: 'admin-id',
      user,
    });
    const requestedUser = createUser({
      id: requestedUserId,
      name: 'Requested User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
    const requestedCustomer = createCustomer({
      id: 'requested-customer-id',
      user: requestedUser,
    });

    sandbox.stub(database.users, 'find')
      .returns(Promise.resolve(user));
    sandbox.stub(database.admins, 'findByUserId')
      .returns(Promise.resolve(admin));
    sandbox.stub(database.customers, 'findByUserId')
      .returns(Promise.resolve(requestedCustomer));
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.reject(new HostessEntityNotCreated()));

    const useCase = new CoffeeUserListsUserRoles({
      userId,
      requestedUserId,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(CorruptedHostess);
        done();
      });
  });
});

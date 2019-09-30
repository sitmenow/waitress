const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  UserModelNotFound,
  UserModelNotCreated } = require('../../../../../../lib/database/errors');
const UserModel = require('../../../../../../db/mongoose/models/user');

suite('Mongoose UserStore #create', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  setup(() => {
    user = createUser({
      id: 'user-id',
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });
  });

  teardown(() => {
    sandbox.restore();

    return UserModel.deleteMany({ _id: user.id });
  });

  test('creates a user model with the given user entity', async () => {
    const userId = await database.users.create(user);

    const storedUser = await UserModel.findById(userId);

    expect(user.name).equal(storedUser.name);
    expect(user.email).equal(storedUser.email);
    expect(user.picture).equal(storedUser.picture);
  });

  test('returns the id of the created user model', async () => {
    const userId = await database.users.create(user);

    expect(userId).equal(user.id);
  });

  test('throws a user model not created error ' +
       'when an error occurs while casting the user entity', (done) => {
    sandbox.stub(database.users, '_objectToModel')
      .throws(new UserModelNotCreated());

    database.users.create(user)
      .catch((error) => {
        expect(error).to.be.instanceof(UserModelNotCreated);
        done();
      });
  });
});

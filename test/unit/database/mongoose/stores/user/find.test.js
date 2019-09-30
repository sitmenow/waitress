const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  UserModelNotFound,
  UserEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose UserStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  setup(() => {
    userModel = createUserModel({
      _id: 'user-id',
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/picture',
    });

    return userModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return userModel.delete();
  });

  test('finds the user for the requested id', async () => {
    const expectedUser = createUser({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      picture: userModel.picture,
    });

    const user = await database.users.find(userModel.id);

    expect(user).deep.equal(expectedUser);
  });

  test('throws a user model not found error ' +
       'when the given user id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    database.users.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(UserModelNotFound);
        done();
      });
  });

  test('throws a user entity not created error ' +
       'when an error occurs while casting the user model', (done) => {
    sandbox.stub(database.users, '_modelToObject')
      .throws(new UserEntityNotCreated());

    database.users.find(userModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(UserEntityNotCreated);
        done();
      });
  });
});

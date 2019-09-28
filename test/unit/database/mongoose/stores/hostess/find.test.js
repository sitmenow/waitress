const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  HostessModelNotFound,
  HostessEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose HostessStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    userModel = createUserModel({
      id: 'user-id',
      name: 'User Test',
    });
    branchModel = createBranchModel({
      name: 'BranchTest',
      coordinates: [324, 23],
    });

    return Promise.all([
      branchModel.save(),
      userModel.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      branchModel.delete(),
      userModel.delete(),
    ]);
  });

  setup(() => {
    user = createUser({
      id: userModel.id,
    });
    branch = createBranch({
      id: branchModel.id,
    });

    hostessModel = createHostessModel({
      branchId: branchModel.id,
      userId: userModel.id,
    });

    return hostessModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return hostessModel.delete();
  });

  test('finds the hostess for the requested id', async () => {
    const expectedHostess = createHostess({
      id: hostessModel.id,
      branch,
      user,
    });

    const hostess = await database.hostesses.find(hostessModel.id);

    expect(hostess).deep.equal(expectedHostess);
  });

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    database.hostesses.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(HostessModelNotFound);
        done();
      });
  });

  test('throws a hostess entity not created error ' +
       'when an error ocurrs while casting the hostess model', (done) => {
    sandbox.stub(database.hostesses, '_modelToObject')
      .throws(new HostessEntityNotCreated());

    database.hostesses.find(hostessModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(HostessEntityNotCreated);
        done();
      });
  });
});

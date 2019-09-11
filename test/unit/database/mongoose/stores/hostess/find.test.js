const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const errors = require('../../../../../../lib/database/errors');

suite('Mongoose HostessStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModel = createBranchModel({
      name: 'BranchTest',
      coordinates: [324, 23],
    });

    return branchModel.save();
  });

  suiteTeardown(() => {
    return branchModel.delete();
  });

  setup(() => {
    branch = createBranch({
      id: branchModel.id,
    });

    hostessModel = createHostessModel({
      name: 'Hostess Test',
      branchId: branchModel.id,
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
      name: hostessModel.name,
      branch,
    });

    const hostess = await database.hostesses.find(hostessModel.id);

    assert.deepEqual(expectedHostess, hostess);
  });

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    database.hostesses.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.HostessModelNotFound);
        done();
      });
  });

  test('throws a hostess entity not created error ' +
       'when an error ocurrs while casting the hostess model', (done) => {
    sandbox.stub(database.hostesses, '_modelToObject')
      .throws(new errors.HostessEntityNotCreated());

    database.hostesses.find(hostessModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.HostessEntityNotCreated);
        done();
      });
  });
});

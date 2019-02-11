const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const errors = require('../../../../../scheduler/stores/errors');


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
    hostessStore = createHostessStore();

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

    const hostess = await hostessStore.find(hostessModel.id);

    assert.deepEqual(expectedHostess, hostess);
  });

  test('throws a hostess model not found error ' +
       'when the given id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    hostessStore.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.HostessModelNotFound);
        done();
      });
  });

  test('throws a customer entity not created error', (done) => {
    sandbox.stub(hostessStore, '_modelToObject')
      .throws(new errors.HostessEntityNotCreated());

    hostessStore.find(hostessModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.HostessEntityNotCreated);
        done();
      });
  });
});

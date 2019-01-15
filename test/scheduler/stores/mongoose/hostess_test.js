const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const errors = require('../../../../scheduler/stores/errors');


suite('Mongoose HostessStore', () => {
  setup(() => {
    hostessStore = createHostessStore();
  });

  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    branchModel = createBranchModel({
      branchName: 'Branch Test',
      coordinates: [10, 10],
    });

    return branchModel.save();
  });

  suiteTeardown(() => {
    return branchModel.delete();
  });

  suite('#find()', () => {
    teardown(() => {
      sandbox.restore();
    });

    suiteSetup(() => {
      hostessName = 'Hostess Test';
      hostessModel = createHostessModel({
        hostessName,
        branchId: branchModel.id
      });

      return hostessModel.save();
    });

    suiteTeardown(() => {
      return hostessModel.delete();
    });

    test('returns a hostess with the given id', async () => {
      const branch = createBranch({
        branchId: branchModel.id,
      });

      const expectedHostess = createHostess({
        branch,
        hostessName,
        hostessId: hostessModel.id,
      });

      const hostess = await hostessStore.find(hostessModel.id);

      assert.deepEqual(expectedHostess, hostess);
    });

    test('throws a hostess not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      hostessStore.find(nonExistentId)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.HostessNotFound);
          done();
        });
    });

    test('throws a hostess not created error', (done) => {
      sandbox.stub(hostessStore, '_modelToObject')
        .throws(new errors.HostessNotCreated());

      hostessStore.find(hostessModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.HostessNotCreated);
          done();
        });
    });
  });
});

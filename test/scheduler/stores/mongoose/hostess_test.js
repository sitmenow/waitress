const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const storeErrors = require('../../../../scheduler/stores/errors');


suite('Mongoose HostessStore', () => {

  suiteSetup(() => {
    hostessStore = createHostessStore();

    branchName = 'Branch Test'
    branchModel = createBranchModel({ branchName });
    return branchModel.save();
  });

  suiteTeardown(() => {
    return branchModel.delete();
  });

  suite('#find()', () => {

    suiteSetup(() => {
      sandbox = sinon.createSandbox();

      hostessName = 'Hostess Test';
      hostessModel = createHostessModel({
        hostessName,
        branchId: branchModel.id
      });
      return hostessModel.save();
    });

    suiteTeardown(() => {
      sandbox.restore();
      return hostessModel.delete();
    });

    test('returns a hostess with the given id', async () => {
      const branch = createBranch({ id: hostessModel.branchId });
      const expectedHostess = createHostess({
        branch,
        hostessName,
        hostessId: hostessModel.id
      });

      const hostess = await hostessStore.find(hostessModel.id);

      assert.deepEqual(expectedHostess, hostess);
    });

    test('throws a hostess not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      hostessStore.find(nonExistentId)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.HostessNotFound);
          done();
        });
    });

    test('throws a hostess not created error', (done) => {
      sandbox.stub(hostessStore, '_modelToObject')
        .throws(new storeErrors.HostessNotCreated());

      hostessStore.find(hostessModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.HostessNotCreated);
          done();
        });
    });
  });
});

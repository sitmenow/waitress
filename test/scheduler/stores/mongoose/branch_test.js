const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Branch = require('../../../../scheduler/branch');
const BranchStore = require('../../../../scheduler/stores/mongoose/branch');
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const branchStoreErrors = require('../../../../scheduler/stores/errors');


suite('Mongoose BranchStore', () => {

  setup(() => {
    branchStore = new BranchStore();
  });

  suite('#find()', () => {

    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      branchModel = new BranchModel({
        name: 'test',
      });
      return branchModel.save();
    });

    suiteTeardown(() => {
      sandbox.restore();
      return branchModel.delete();
    });

    test('returns a branch with the given id', async () => {
      // BranchModel.findById(branchModel._id)
      //   .then(_ => console.log(_));
      const expectedBranch = new Branch({
        id: branchModel.id,
        name: branchModel.name,
      });
      const branch = await branchStore.find(branchModel.id);

      assert.deepEqual(expectedBranch, branch);
    });

    test('throws a branch not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      branchStore.find(nonExistentId)
        .catch((error) => {
          // NOTE: If the following expect is not fulfilled the promise
          //       will be considered as non-completed. Be careful with
          //       expected types
          expect(error).to.be.instanceof(branchStoreErrors.BranchNotFound);
          done();
        });
    });

    test('throws a branch not created error', (done) => {
      sandbox.stub(branchStore, '_modelToObject')
        .throws(new branchStoreErrors.BranchNotCreated());

      branchStore.find(branchModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(branchStoreErrors.BranchNotCreated);
          done();
        });
    });
  });
});

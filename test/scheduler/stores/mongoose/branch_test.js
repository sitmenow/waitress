const { assert, expect } = require('chai');
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
      branchModel = new BranchModel({
        name: 'test',
      });
      expectedBranch = new Branch({
        id: branchModel.id,
        name: branchModel.name,
      });
      return branchModel.save();
    });

    suiteTeardown(() => {
      return branchModel.delete();
    });

    test('returns a branch with the given id', async () => {
      // BranchModel.findById(branchModel._id)
      //   .then(_ => console.log(_));
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
  });
});

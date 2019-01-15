const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const BranchStore = require('../../../../scheduler/stores/mongoose/branch');
const errors = require('../../../../scheduler/stores/errors');


suite('Mongoose BranchStore', () => {
  setup(() => {
    branchStore = new BranchStore();
  });

  suite('#find()', () => {
    suiteSetup(() => {
      sandbox = sinon.createSandbox();

      branchName = 'Branch Test';
      branchAddress = 'Address Test #10';
      lastOpeningTime = new Date();
      lastClosingTime = new Date();
      coordinates = [104, -213];
      restaurant = createRestaurant();
      branchModel = createBranchModel({
        branchName,
        branchAddress,
        lastOpeningTime,
        lastClosingTime,
        coordinates,
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
      const expectedBranch = createBranch({
        branchName,
        branchAddress,
        lastOpeningTime,
        lastClosingTime,
        coordinates,
        restaurant,
        branchId: branchModel.id,
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
          expect(error).to.be.instanceof(errors.BranchNotFound);
          done();
        });
    });

    test('throws a branch not created error', (done) => {
      sandbox.stub(branchStore, '_modelToObject')
        .throws(new errors.BranchNotCreated());

      branchStore.find(branchModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(errors.BranchNotCreated);
          done();
        });
    });
  });
});

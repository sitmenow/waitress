const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose BranchStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    brandModel = createBrandModel({
      name: 'Brand Test',
    });

    return brandModel.save();
  });

  suiteTeardown(() => {
    return brandModel.delete();
  });

  setup(() => {
    branchStore = createBranchStore();

    brand = createBrand({
      id: brandModel.id,
    });

    branchModel = createBranchModel({
      name: 'Branch Test',
      address: 'Brand Address Test #10',
      lastOpeningTime: new Date(),
      lastClosingTime: null,
      coordinates: [104, -123],
      brandId: brandModel.id,
    });

    return branchModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return branchModel.delete();
  });

  test('finds the object for the requested id', async () => {
    const expectedBranch = createBranch({
      id: branchModel.id,
      name: branchModel.name,
      address: branchModel.address,
      lastOpeningTime: branchModel.lastOpeningTime,
      lastClosingTime: branchModel.lastClosingTime,
      coordinates: branchModel.location.coordinates,
      brand,
    });

    const branch = await branchStore.find(branchModel.id);

    assert.deepEqual(expectedBranch, branch);
  });

  test('throws a branch model not found error', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    branchStore.find(nonExistentId)
      .catch((error) => {
        // NOTE: If the following expect is not fulfilled the promise
        //       will be considered as non-completed. Be careful with
        //       expected types
        expect(error).to.be.instanceof(errors.BranchModelNotFound);
        done();
      });
  });

  test('throws a branch entity not created error', (done) => {
    sandbox.stub(branchStore, '_modelToObject')
      .throws(new errors.BranchEntityNotCreated());

    branchStore.find(branchModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.BranchEntityNotCreated);
        done();
      });
  });
});

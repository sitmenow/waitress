const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  BranchModelNotFound,
  BranchEntityNotCreated } = require('../../../../../../lib/database/errors');

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

  test('finds the branch for the requested id', async () => {
    const expectedBranch = createBranch({
      id: branchModel.id,
      name: branchModel.name,
      address: branchModel.address,
      lastOpeningTime: branchModel.lastOpeningTime,
      lastClosingTime: branchModel.lastClosingTime,
      coordinates: branchModel.location.coordinates,
      brand,
    });

    const branch = await database.branches.find(branchModel.id);

    assert.deepEqual(expectedBranch, branch);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    database.branches.find(nonExistentId)
      .catch((error) => {
        // NOTE: If the following expect is not fulfilled the promise
        //       will be considered as non-completed. Be careful with
        //       expected types
        expect(error).to.be.instanceof(BranchModelNotFound);
        done();
      });
  });

  test('throws a branch entity not created error ' +
       'when an error occurs while casting the branch model', (done) => {
    sandbox.stub(database.branches, '_modelToObject')
      .throws(new BranchEntityNotCreated());

    database.branches.find(branchModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(BranchEntityNotCreated);
        done();
      });
  });
});

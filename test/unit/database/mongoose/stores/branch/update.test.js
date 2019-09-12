const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const BranchModel = require('../../../../../../db/mongoose/models/branch');
const {
  BranchModelNotFound,
  BranchEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose BranchStore #update()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    brandModel = createBrandModel({
      name: 'Brand Test',
    });
    newBrandModel = createBrandModel({
      name: 'New Brand Test',
    });

    return Promise.all(
      [brandModel.save(), newBrandModel.save()]
    );
  });

  suiteTeardown(() => {
    return Promise.all(
      [brandModel.delete(), newBrandModel.delete()]
    );
  });

  setup(() => {
    brand = createBrand({
      id: brandModel.id,
    });
    newBrand = createBrand({
      id: newBrandModel.id,
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

  test('updates branch with the given object', async () => {
    const updatedBranch = createBranch({
      id: branchModel.id,
      name: 'New Branch Test',
      address: 'New Branch Address #11',
      lastOpeningTime: new Date(),
      lastClosingTime: new Date(),
      coordinates: [1, 1],
      brand: newBrand,
    });

    const branch = await database.branches.update(updatedBranch);

    const storedBranch = await BranchModel.findById(branchModel.id);

    assert.equal(updatedBranch.id, storedBranch.id);
    assert.equal(updatedBranch.name, storedBranch.name);
    assert.equal(updatedBranch.address, storedBranch.address);
    assert.equal(updatedBranch.brand.id, storedBranch.brandId);
    assert.deepEqual(
      updatedBranch.coordinates,
      storedBranch.location.coordinates
    );
    assert.equal(
      updatedBranch.lastOpeningTime.getTime(),
      storedBranch.lastOpeningTime.getTime()
    );
    assert.equal(
      updatedBranch.lastClosingTime.getTime(),
      storedBranch.lastClosingTime.getTime()
    );
  });

  test('throws a branch model not found error ' +
       'when the given branch does not exist', (done) => {
    const updatedBranch = createBranch({
      id: mongoose.Types.ObjectId(),
      name: 'New Branch Test',
    });

    database.branches.update(updatedBranch)
      .catch((error) => {
        expect(error).to.be.instanceof(BranchModelNotFound);
        done();
      });
  });
});

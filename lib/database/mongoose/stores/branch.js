const Brand = require('../../../brand');
const Branch = require('../../../branch');
const BrandModel = require('../../../../db/mongoose/models/brand');
const BranchModel = require('../../../../db/mongoose/models/branch');
const {
  BranchEntityNotCreated,
  BranchModelNotFound,
  BranchModelNotCreated } = require('../../errors');

class BranchStore {
  async all() {
    const models = await BranchModel.find({})
      .populate('brand');

    return models.map(this._modelToObject);
  }

  async create(branch) {
    model = this._objectToModel(branch);
    await model.save();

    return model.id;
  }

  async find(branchId) {
    const model = await BranchModel.findById(branchId);

    if (!model) throw new BranchModelNotFound(branchId);

    return this._modelToObject(model);
  }

  async update(branch) {
    const model = await BranchModel.findById(branch.id);

    if (!model) throw new BranchModelNotFound(branch.id);

    model.name = branch.name;
    model.address = branch.address;
    model.location = {
      type: 'Point',
      coordinates: branch.coordinates,
    };
    model.lastOpeningTime = branch.lastOpeningTime;
    model.lastClosingTime = branch.lastClosingTime;
    model.brandId = branch.brand.id;

    await model.save();
  }

  _modelToObject(model) {
    let branch = null;

    try {
      branch = new Branch({
        id: model.id,
        name: model.name,
        address: model.address,
        coordinates: model.location.coordinates,
        lastOpeningTime: model.lastOpeningTime,
        lastClosingTime: model.lastClosingTime,
        picture: model.picture,
        brand: new Brand({
          id: model.brand.id.toString(),
          name: model.brand.name,
          picture: model.brand.picture,
        }),
      });
    } catch (error) {
      throw new BranchEntityNotCreated(model.id, error.stack);
    }

    return branch;
  }

  _objectToModel(branch) {
    model = null;

    try {
      model = new BranchModel({
        name: branch.name,
        address: branch.address,
        lastOpeningTime: branch.lastOpeningTime,
        lastClosingTime: branch.lastClosingTime,
        picture: branch.picture,
        location: {
          type: 'Point',
          coordinates: branch.coordinates,
        },
        brand: {
          _id: branch.brand.id,
        },
      });
    } catch (error) {
      throw new BranchModelNotCreated(branch.id, error.stack);
    }

    return model;
  }
}

module.exports = BranchStore;

const Branch = require('../../branch');
const Restaurant = require('../../restaurant');
const BranchModel = require('../../../services/db/mongoose/models/branch');
const storeErrors = require('../errors');


class BranchStore {
  async all() {
    const models = await BranchModel.find({});

    return models.map(this._modelToObject);
  }

  async create(branch) {
    model = this._objectToModel(branch);
    await model.save();
  }

  async find(branchId) {
    const model = await BranchModel.findById(branchId);

    if (!model) throw new storeErrors.BranchNotFound(branchId);

    return this._modelToObject(model);
  }

  async update(branch) {
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
        restaurant: new Restaurant({
          id: model.restaurantId,
        }),
      });
    } catch (error) {
      throw new storeErrors.BranchNotCreated();
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
        location: {
          type: 'Point',
          coordinates: branch.coordinates,
        },
        restaurantId: branch.restaurant.id,
      });
    } catch (error) {
      throw new storeErrors.BranchModelNotCreated();
    }

    return model;
  }
}

module.exports = BranchStore;

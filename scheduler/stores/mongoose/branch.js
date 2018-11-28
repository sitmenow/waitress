const Branch = require('../../branch');
const BranchModel = require('../../../services/db/mongoose/models/branch');
const { BranchNotFound } = require('../errors');


class BranchStore {
  async create(branch) {
    model = this._objectToModel(branch);
    await model.save();
  }

  async find(branchId) {
    model = BranchModel.findById(branchId);

    if (!model) throw new BranchNotFound(branchId);

    return this._modelToObect(model);
  }

  async update(branch) {
  }

  _modelToObject(model) {
    branch = null;

    try {
      branch = new Branch({
        id: model.id,
        name: model.name,
        address: model.address,
        schedule: new Schedule(),
        restaurant: new Restaurant({
          id: model.restaurantId,
        }),
      });
    } catch (error) {
      throw new BranchNotCreated();
    }

    return branch;
  }

  _objectToModel(branch) {
    model = null;

    try {
      model = new BranchModel({
        name: branch.name,
        address: branch.address,
        // schedule: branch.schedule,
        restaurantId: branch.restaurant.id,
      });
    } catch (error) {
      throw new BranchModelNotCreated();
    }

    return model;
  }
}

module.exports = BranchStore;

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
        schedule: new Schedule(),
      });
    } catch (error) {
      throw new BranchNotCreated();
    }

    return branch;
  }

  _objectToModel(branch) {
    model = null;

    try {
      model = new BranchModel({});
    } catch (error) {
      throw new BranchModelNotCreated();
    }

    return model
  }
}

module.exports = BranchStore;

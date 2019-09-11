const Branch = require('../../../branch');
const Hostess = require('../../../hostess');
const HostessModel = require('../../../../db/mongoose/models/hostess');
const errors = require('../../errors');

class HostessStore {
  async all() {
    const models = await HostessModel.find({});

    return models.map(this._modelToObject)
  }

  async create(hostess) {
    const model = this._objectToModel(hostess);

    await model.save();

    return model.id;
  }

  async find(hostessId) {
    const model = await HostessModel.findById(hostessId);

    if (!model) throw new errors.HostessModelNotFound(hostessId);

    return this._modelToObject(model);
  }

  update(hostess) {
  }

  _modelToObject(model) {
    let hostess = null;

    try {
      hostess = new Hostess({
        id: model.id,
        name: model.name,
        branch: new Branch({
          id: model.branchId.toString()
        }),
      });
    } catch (error) {
      throw new errors.HostessEntityNotCreated(model.id, error.stack);
    }

    return hostess;
  }

  _objectToModel(hostess) {
    let model = null;

    try {
      model = new HostessModel({
        name: hostess.name,
        branchId: hostess.branch.id,
      });

    } catch (error) {
      throw new errors.HostessModelNotCreated(hostess.id, error.stack);
    }

    return model;
  }
}

module.exports = HostessStore;

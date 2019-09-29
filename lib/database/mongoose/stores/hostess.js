const Branch = require('../../../branch');
const User = require('../../../user');
const Hostess = require('../../../hostess');
const HostessModel = require('../../../../db/mongoose/models/hostess');
const {
  HostessModelNotFound,
  HostessModelNotCreated,
  HostessEntityNotCreated } = require('../../errors');

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

    if (!model) throw new HostessModelNotFound(hostessId);

    return this._modelToObject(model);
  }

  async findByUserId(userId) {
    const model = await UserModel.findOne({ userId });

    if (!model) throw new UserModelNotFound(userId, 'userId');

    return this._modelToObject(model);
  }

  _modelToObject(model) {
    let hostess = null;

    try {
      hostess = new Hostess({
        id: model.id,
        user: new User({
          id: model.userId.toString(),
        }),
        branch: new Branch({
          id: model.branchId.toString()
        }),
      });
    } catch (error) {
      throw new HostessEntityNotCreated(model.id, error.stack);
    }

    return hostess;
  }

  _objectToModel(hostess) {
    let model = null;

    try {
      model = new HostessModel({
        branchId: hostess.branch.id,
        userId: hostess.user.id,
      });

    } catch (error) {
      throw new HostessModelNotCreated(hostess.id, error.stack);
    }

    return model;
  }
}

module.exports = HostessStore;

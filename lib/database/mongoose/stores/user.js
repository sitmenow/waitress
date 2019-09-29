const User = require('../../../user');
const UserModel = require('../../../../db/mongoose/models/user');
const {
  UserModelNotFound,
  UserEntityNotCreated,
  UserModelNotCreated } = require('../../errors');

class UserStore {
  async create(user) {
    const model = this._objectToModel(user);

    await model.save();

    return model.id;
  }

  async find(userId) {
    const model = await UserModel.findById(userId);

    if (!model) throw new UserModelNotFound(userId);

    return this._modelToObject(model);
  }

  async findByName(username) {
    const model = await UserModel.findOne({ name: username });

    if (!model) throw new UserModelNotFound(username, 'name');

    return this._modelToObject(model);
  }

  _modelToObject(model) {
    let user = null;

    try {
      user = new User({
        id: model.id,
        name: model.name,
        email: model.email,
        picture: model.picture,
      });
    } catch (error) {
      throw new UserEntityNotCreated(model.id, error.stack);
    }

    return customer;
  }

  _objectToModel(user) {
    let model = null;

    try {
      model = new UserModel({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      });
    } catch (error) {
      throw new UserModelNotCreated(model.id, error.stack);
    }

    return model;
  }
}

module.exports = UserStore;

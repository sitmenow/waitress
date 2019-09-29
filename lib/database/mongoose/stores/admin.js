const Admin = require('../../../admin');
const User = require('../../../user');
const AdminModel = require('../../../../db/mongoose/models/admin');
const {
  AdminModelNotFound,
  AdminEntityNotCreated,
  AdminModelNotCreated } = require('../../errors');

class AdminStore {
  async findByUserId(userId) {
    const model = await AdminModel.findOne({ userId });

    if (!model) throw new AdminModelNotFound(userId, 'userId');

    return this._modelToObject(model);
  }

  _modelToObject(model) {
    let admin = null;

    try {
      admin = new Admin({
        id: model.id,
        user: new User({
          id: model.userId.toString(),
        }),
      });
    } catch (error) {
      throw new AdminEntityNotCreated(model.id, error.stack);
    }

    return admin;
  }

  _objectToModel(admin) {
    let model = null;

    try {
      model = new AdminModel({
        userId: admin.user.id,
      });
    } catch (error) {
      throw new AdminModelNotCreated(model.id, error.stack);
    }

    return model;
  }
}

module.exports = AdminStore;

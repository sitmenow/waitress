const Customer = require('../../../customer');
const User = require('../../../user');
const CustomerModel = require('../../../../db/mongoose/models/customer');
const {
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  CustomerModelNotCreated } = require('../../errors');

class CustomerStore {
  async create(customer) {
    const model = this._objectToModel(customer);

    await model.save();

    return model.id;
  }

  async find(customerId) {
    const model = await CustomerModel.findById(customerId);

    if (!model) throw new CustomerModelNotFound(customerId);

    return this._modelToObject(model);
  }

  // Slack coffee turns hack
  async findByName(customerName) {
    const model = await CustomerModel.findOne({ name: customerName });

    if (!model) throw new CustomerModelNotFound(customerName);

    return this._modelToObject(model);
  }

  async findByUserId(userId) {
    const model = await CustomerModel.findOne({ userId });

    if (!model) throw new CustomerModelNotFound(userId, 'userId');

    return this._modelToObject(model);
  }

  async update(customer) {
  }

  _modelToObject(model) {
    let customer = null;

    try {
      customer = new Customer({
        id: model.id,
        user: new User({
          id: model.userId.toString(),
        }),
      });
    } catch (error) {
      throw new CustomerEntityNotCreated(model.id, error.stack);
    }

    return customer;
  }

  _objectToModel(customer) {
    let model = null;

    try {
      model = new CustomerModel({
        userId: customer.user.id,
      });
    } catch (error) {
      throw new CustomerModelNotCreated(model.id, error.stack);
    }

    return model;
  }
}

module.exports = CustomerStore;

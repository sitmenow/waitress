const Customer = require('../../customer');
const CustomerModel = require('../../../services/db/mongoose/models/customer');
const errors = require('../errors');

class CustomerStore {
  async create(customer) {
    const model = this._objectToModel(customer);

    await model.save();

    return model.id;
  }

  async find(customerId) {
    const model = await CustomerModel.findById(customerId);

    if (!model) throw new errors.CustomerModelNotFound(customerId);

    return this._modelToObject(model);
  }

  // Slack coffee turns hack
  async findByName(customerName) {
    const model = await CustomerModel.findOne({ name: customerName });

    if (!model) throw new errors.CustomerModelNotFound(customerName);

    return this._modelToObject(model);
  }

  async update(customer) {
  }

  _modelToObject(model) {
    let customer = null;

    try {
      customer = new Customer({
        id: model.id,
        name: model.name,
      });
    } catch (error) {
      throw new errors.CustomerEntityNotCreated(model.id, error.stack);
    }

    return customer;
  }

  _objectToModel(customer) {
    let model = null;

    try {
      model = new CustomerModel({
        name: customer.name,
      });
    } catch (error) {
      throw new errors.CustomerModelNotCreated(model.id, error.stack);
    }

    return model;
  }
}

module.exports = CustomerStore;

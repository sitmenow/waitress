const Customer = require('../../customer');
const CustomerModel = require('../../../services/db/mongoose/models/customer');
const storeErrors = require('../errors');

class CustomerStore {
  async create(customer) {
    model = this._objectToModel(customer);
    await model.save();
  }

  async find(customerId) {
    const model = await CustomerModel.findById(customerId);

    if (!model) throw new storeErrors.CustomerNotFound(customerId);

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
      console.log(error)
      throw new storeErrors.CustomerNotCreated();
    }

    return customer;
  }

  _objectToModel(customer) {
    let model = null;

    try {
      model = new CustomerModel(customer);
    } catch (error) {
      throw new storeErrors.CustomerModelNotCreated();
    }

    return model;
  }
}

module.exports = CustomerStore;

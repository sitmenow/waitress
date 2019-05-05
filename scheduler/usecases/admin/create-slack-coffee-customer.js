const Customer = require('../../customer');
const errors = require('./errors');

// AdminId is supposed to be verified but this comes from slack

class AdminCreateSlackCoffeeCustomer {
  constructor({
    channel, username, customerStore,
  }) {
    this.channel = channel;
    this.username = username;
    this.customerStore = customerStore;
  }

  execute() {
    const name = `${this.username}_${this.channel}`;
    const customer = new Customer({ name });

    return this.customerStore.create(customer)
      .then(customerId => this.customerStore.find(customerId))
      .catch(this._manageError);
  }

  _manageError(error) {
    if (error instanceof storeErrors.CustomerModelNotFound) {
      throw new errors.SlackCustomerNotFound(this.channel, this.username);
    } else if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerNotCreated(); // Unknown error
    } else if (error instanceof storeErrors.CustomerModelNotCreated) {
      throw new errors.CustomerNotCreated();
    }

    throw error;
  }
}

module.exports = AdminCreateSlackCoffeeCustomer;

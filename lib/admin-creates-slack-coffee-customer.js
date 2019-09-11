const Customer = require('../../customer');
const errors = require('./errors');

// AdminId is supposed to be verified but this comes from slack

class AdminCreateSlackCoffeeCustomer {
  constructor({
    channel, username, database,
  }) {
    this.channel = channel;
    this.username = username;
    this.database = database;
  }

  execute() {
    const name = `${this.username}_${this.channel}`;
    const customer = new Customer({ name });

    return this.database.customers.create(customer)
      .then(customerId => this.database.customers.find(customerId))
      .catch(this._manageError);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.CustomerModelNotFound) {
      throw new errors.SlackCustomerNotFound(this.channel, this.username);
    } else if (error instanceof databaseErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerNotCreated(); // Unknown error
    } else if (error instanceof databaseErrors.CustomerModelNotCreated) {
      throw new errors.CustomerNotCreated();
    }

    throw error;
  }
}

module.exports = AdminCreateSlackCoffeeCustomer;

const Customer = require('./customer');
const { SlackCustomerNotFound, CustomerNotCreated } = require('./admin-errors');
const {
  CustomerModelNotFound, CustomerEntityNotCreated, CustomerModelNotCreated,
} = require('./database/errors');

// AdminId is supposed to be verified but this comes from slack

class AdminCreatesSlackCoffeeCustomer {
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
    if (error instanceof CustomerModelNotFound) {
      throw new SlackCustomerNotFound(this.channel, this.username);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new CustomerNotCreated(); // Unknown error
    } else if (error instanceof CustomerModelNotCreated) {
      throw new CustomerNotCreated();
    }

    throw error;
  }
}

module.exports = AdminCreatesSlackCoffeeCustomer;

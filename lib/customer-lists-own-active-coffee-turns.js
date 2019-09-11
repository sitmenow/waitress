const errors = require('./customer-errors');
const databaseErrors = require('./database/errors');

class CustomerListsOwnActiveCoffeeTurns {
  constructor({ customerId, database } = {}) {
    this.customerId = customerId;
    this.database = database;
  }

  execute() {
    return this.database.customers.find(this.customerId)
      .then(customer => this.database.turnsCache.findByCustomer(customer.id))
      .catch(error => this._manageError(error));
  }

  _manageError(error) {
    if (error instanceof databaseErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    }
    if (error instanceof databaseErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }

    throw error;
  }
}

module.exports = CustomerListsOwnActiveCoffeeTurns;

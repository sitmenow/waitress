const {
  CustomerNotFound,
  CorruptedCustomer,
  CorruptedTurn } = require('./errors');
const {
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  TurnEntityNotCreated } = require('./database/errors');

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
    if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    }
    if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    }
    if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }

    throw error;
  }
}

module.exports = CustomerListsOwnActiveCoffeeTurns;

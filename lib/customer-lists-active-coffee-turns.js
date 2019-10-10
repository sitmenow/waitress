const {
  CustomerNotFound,
  CorruptedCustomer,
  CorruptedTurn } = require('./errors');
const {
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  TurnEntityNotCreated } = require('./database/errors');


class CustomerListsActiveCoffeeTurns {
  constructor({ userId, database } = {}) {
    this.userId = userId;
    this.database = database;
  }

  execute() {
    return this.database.customers.findByUserId(this.userId)
      .then(customer =>
        this.database.turnsCache.findByCustomerId(customer.id)
      )
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

module.exports = CustomerListsActiveCoffeeTurns;

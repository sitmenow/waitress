const errors = require('./errors');
const storeErrors = require('../../stores/errors');

class CustomerListOwnActiveCoffeeTurns {
  constructor({
    customerId, customerStore, turnCacheStore,
  } = {}) {
    this.customerId = customerId;
    this.customerStore = customerStore;
    this.turnCacheStore = turnCacheStore;
  }

  execute() {
    return this.customerStore.find(this.customerId)
      .then(customer => this.turnCacheStore.findByCustomer(customer.id))
      .catch(error => this._manageError(error));
  }

  _manageError(error) {
    if (error instanceof storeErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    }
    if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }

    throw error;
  }
}

module.exports = CustomerListOwnActiveCoffeeTurns;

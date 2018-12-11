const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');

class CustomerDetailTurn {
  constructor(customer, turn, customerStore, turnStore) {
    this.turn = turn;
    this.customer = customer;
    this.turnStore = turnStore;
    this.customerStore = customerStore;

    this._validate();
  }

  execute() {
    const customer = this.customerStore.find(this.customer.id);
    const turn = this.turnStore.find(this.turn.id);

    return Promise.all([customer, turn])
      .then(([customer, turn]) => this._checkTurnOwnership(customer, turn))
      .catch(error => this._manageError(error));
  }

  _checkTurnOwnership(customer, turn) {
    if (customer.id != turn.customer.id) {
      throw new customerUseCaseErrors.TurnDoesNotBelongToCustomer();
    }

    return turn;
  }

  _manageError(error) {
    if (error instanceof storeErrors.TurnNotFound) {
      throw new customerUseCaseErrors.TurnNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new customerUseCaseErrors.CustomerNotFound();
    }

    console.log(error);
    throw error;
  }

  _validate() {
    if (!this.turn) {
      throw new customerUseCaseErrors.TurnNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }

    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new customerUseCaseErrors.CustomerStoreNotPresent();
    }
  }
}

const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerRemoveTurn {
  constructor(turn, customer, turnStore, customerStore) {
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
      .then(([customer, turn]) => this._removeTurn(customer, turn))
      // update sockets!!
      .catch(error => this._manageError(error));
  }

  _removeTurn(customer, turn) {
    if (customer.id != turn.customer.id) {
      throw new customerUseCaseErrors.TurnDoesNotBelongToCustomer();
    }

    // Allow removing even if branch is closed?
    turn.remove()
    return this.turnStore.update(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.CustomerNotFound) {
      throw new customerUseCaseErrors.CustomerNotFound();
    } else if (error instanceof storeErrors.TurnNotFound) {
      throw new customerUseCaseErrors.TurnNotFound();
    }

    console.log(error);
    throw error;
  }

  _validate() {
    if (!this.turn) {
      throw new customerUseCaseErrors.TurnNotPresent();
    }

    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new customerUseCaseErrors.CustomerStoreNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }
  }
}

module.exports = CustomerRemoveTurn;

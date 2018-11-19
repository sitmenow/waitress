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
    if (!customer) throw new customerUseCaseErrors.CustomerNotFound();

    const turn = this.turnStore.find(this.turn.id);
    if (!turn) throw new customerUseCaseErrors.TurnNotFound();

    if (customer.id != turn.customer.id) {
      throw new customerUseCaseErrors.TurnDoesNotBelongToCustomer();
    }

    turn.remove()
    return this.turnStore.update(turn);
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

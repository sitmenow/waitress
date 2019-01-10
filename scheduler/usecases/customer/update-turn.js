const Turn = require('../../turn');
const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerUpdateTurn {
  constructor(customer, turn, customerStore, turnStore, branchStore) {
    this.turn = turn;
    this.customer = customer;
    this.turnStore = turnStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    const customer = this.customerStore.find(this.customer.id);
    const turn = this.turnStore.find(this.turn.id);

    return Promise.all([customer, turn])
      .then(([customer, turn]) => this._updateTurn(customer, turn))
      .catch(error => this._manageError(error));
  }

  async _updateTurn(customer, turn) {
    if (customer.id != turn.customer.id) {
      throw new errors.TurnDoesNotBelongToCustomer();
    }

    if (!turn.isWaiting()) {
      throw new errors.InactiveTurn();
    }

    let requestedTime = this.turn.requestedTime;

    if (this.turn.requestedTime != turn.requestedTime) {
      requestedTime = null;
    }

    const branch = await this.branchStore.find(turn.branch.id);

    if (!branch.isOpen(requestedTime)) {
      throw new errors.BranchIsNotOpen();
    }

    const updatedTurn = new Turn({
      name: this.turn.name || turn.name,
      guests: this.turn.guests || turn.guests,
      requestedTime: requestedTime,
      branch: branch,
      customer: customer,
    });

    return this.turnStore.update(updatedTurn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    } else if (error instanceof storeErrors.TurnNotFound) {
      throw new errors.TurnNotFound();
    }

    throw error;
  }

  _validate() {
    if (!this.turn) {
      throw new errors.TurnNotPresent();
    }

    if (!this.customer) {
      throw new errors.CustomerNotPresent();
    }

    if (!this.turnStore) {
      throw new errors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new errors.CustomerStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new errors.BranchStoreNotPresent();
    }
  }
}

module.exports = CustomerUpdateTurn;

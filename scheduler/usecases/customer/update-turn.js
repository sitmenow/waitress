const Turn = require('../../turn');
const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerUpdateTurn {
  constructor({
    turnId,
    turnName,
    turnGuests,
    customerId,
    customerStore,
    turnStore,
    branchStore
  }) {
    this.turnId = turnId;
    this.turnName = turnName;
    this.turnGuests = turnGuests;
    this.customerId = customerId;
    this.turnStore = turnStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;
  }

  execute() {
    const customer = this.customerStore.find(this.customerId);
    const turn = this.turnStore.find(this.turnId);

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

    const branch = await this.branchStore.find(turn.branch.id);

    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    const updatedTurn = new Turn({
      name: this.turnName || turn.name,
      guests: this.turnGuests || turn.guests,
      requestedTime: turn.requestedTime,
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
    } else if (error instanceof storeErrors.TurnNotUpdated) {
      throw new errors.TurnNotUpdated();
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerUpdateTurn;

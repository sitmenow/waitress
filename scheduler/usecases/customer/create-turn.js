const Turn = require('../../turn');
const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerCreateTurn {
  constructor({
    turnName,
    turnGuests,
    customerId,
    branchId,
    turnStore,
    customerStore,
    branchStore,
  }) {
    this.turnName = turnName;
    this.turnGuests = turnGuests;
    this.branchId = branchId;
    this.customerId = customerId;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
    this.customerStore = customerStore;
  }

  execute() {
    const customer = this.customerStore.find(this.customerId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._createTurn(customer, branch))
      // update sockets!
      .catch(error => this._manageError(error));
  }

  _createTurn(customer, branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    const turn = new Turn({
      name: this.turnName || customer.name,
      guests: this.turnGuests,
      branch: branch,
      customer: customer,
    });

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    } else if (error instanceof storeErrors.CustomerNotCreated) {
      throw new errors.CustomerNotCreated();
    } else if (error instanceof storeErrors.TurnNotCreated) {
      throw new errors.TurnNotCreated();
    }

    throw error;
  }
}

module.exports = CustomerCreateTurn;

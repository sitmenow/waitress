const Turn = require('../../turn');
const storeErrors = require('../../stores/errors');
const errors = require('./errors');

class HostessCreateTurn {
  constructor({
    hostessId,
    turnName,
    turnGuests,
    hostessStore,
    turnStore,
    customerStore,
    branchStore
  }) {
    this.hostessId = hostessId;
    this.turnName = turnName;
    this.turnGuests = turnGuests;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;
  }

  execute() {
    const customer = this.customerStore.getDefaultCustomer();
    const branch = this.hostessStore.find(this.hostessId)
      .then(hostess => this.branchStore.find(hostess.id));

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._createTurn(customer, branch))
      .catch(error => this._manageError(error));
  }

  _createTurn(customer, branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    if (!this.turnName) {
      throw new errors.MissingTurnName();
    }

    const turn = new Turn({
      name: this.turnName,
      guests: this.turnGuests,
      customer: customer,
      branch: branch,
    });

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.HostessDoesNotBelongToAnyBranch();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new errors.DefaultCustomerNotFound();
    } else if (error instanceof storeErrors.CustomerNotCreated) {
      throw new errors.DefaultCustomerNotCreated();
    } else if (error instanceof storeErrors.HostessNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.TurnNotCreated) {
      throw new errors.TurnNotCreated();
    }

    // TODO: Log unknown errors
    // console.log(error)
    throw error;
  }
}

module.exports = HostessCreateTurn;

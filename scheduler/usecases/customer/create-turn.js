const Turn = require('../../turn');
const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerCreateTurn {
  constructor(customer, turn, branch, turnStore, customerStore, branchStore) {
    this.turn = turn;
    this.branch = branch;
    this.customer = customer;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
    this.customerStore = customerStore;

    this._validate();
  }

  execute() {
    const customer = this.customerStore.find(this.customer.id);
    const branch = this.branchStore.find(this.branch.id);

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._createTurn(customer, branch))
      // update sockets!
      .catch(error => this._manageError(error));
  }

  _createTurn(customer, branch) {
    if (!branch.isOpen()) {
      throw new customerUseCaseErrors.BranchIsNotOpen();
    }

    const turn = new Turn({
      name: this.turn.name || customer.name,
      guests: this.turn.guests,
      branch: branch,
      customer: customer,
    });

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new customerUseCaseErrors.BranchNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new customerUseCaseErrors.CustomerNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new customerUseCaseErrors.BranchNotCreated();
    } else if (error instanceof storeErrors.CustomerNotCreated) {
      throw new customerUseCaseErrors.CustomerNotCreated();
    }

    throw error;
  }

  _validate() {
    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new customerUseCaseErrors.CustomerStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new customerUseCaseErrors.BranchStoreNotPresent();
    }

    if (!this.branch) {
      throw new customerUseCaseErrors.BranchNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }

    if (!this.turn) {
      throw new customerUseCaseErrors.TurnNotPresent();
    }
  }
}

module.exports = CustomerCreateTurn;

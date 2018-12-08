const Turn = require('../../turn');
const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');

class HostessCreateTurn {
  constructor(hostess, turn, hostessStore, turnStore, customerStore, branchStore) {
    this.hostess = hostess;
    this.turn = turn;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    const customer = this.customerStore.getDefaultCustomer();
    const branch = this.hostessStore.find(this.hostess.id)
      .then(hostess => this.branchStore.find(hostess.id));

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._createTurn(customer, turn))
      .catch(error => this._manageError(error));
  }

  _createTurn(customer, turn) {
    if (!branch.isOpen()) {
      throw new hostessUseCaseErrors.BranchIsNotOpen();
    }

    if (!this.turn.name) {
      throw new hostessUseCaseErrors.MissingTurnName();
    }

    const turn = new Turn({
      name: this.turn.name,
      customer: customer,
      branch: branch,
    });

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new hostessUseCaseErrors.CustomerNotFound();
    } else if (error instanceof storeErrors.HosstesNotFound) {
      throw new hostessUseCaseErrors.HostessNotFound();
    }

    console.log(error);
    throw error;
  }

  _validate() {
    if (!this.hostess) {
      throw new hostessUseCaseErrors.HostessNotPresent();
    }

    if (!this.turn) {
      throw new hostessUseCaseErrors.TurnNotPresent();
    }

    if (!this.turnStore) {
      throw new hostesUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.hostessStore) {
      throw new hostessUseCaseErrors.HostessStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new hostessUseCaseErrors.CustomerStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new hostessUseCaseErrors.BranchStoreNotPresent();
    }
  }
}

module.exports = HostessCreateTurn;

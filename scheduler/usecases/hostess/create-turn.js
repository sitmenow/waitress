const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');
const Turn = require('../../turn');

class HostessCreateTurn {
  constructor(hostess, turn, hostessStore, turnStore, customerStore) {
    this.hostess = hostess;
    this.turn = turn;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.customerStore = customerStore;

    this._validate();
  }

  execute() {
    const customer = this.customerStore.getDefaultCustomer();
    if (!customer) throw new hostessUseCaseErrors.CustomerNotFound();

    const hostess = this.hostessStore.find(this.hostess.id);
    if (!hostess) throw new hostessUseCaseErrors.HostessNotFound();

    if (!hostess.branch) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    }

    if (!this.turn.name) {
      throw new hostessUseCaseErrors.MissingTurnName();
    }

    const turn = new Turn({
      name: this.turn.name,
      customer: customer,
      branch: hostess.branch,
      requested_time: this.turn.requested_time,
    });

    return this.turnStore.create(turn);
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
  }
}

module.exports = HostessCreateTurn;

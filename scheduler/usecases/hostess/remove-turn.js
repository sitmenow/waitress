const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');

class HostessRemoveTurn {
  constructor(hostess, turn, hostessStore, turnStore) {
    this.hostess = hostess;
    this.turn = turn;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;

    this._validate();
  }

  execute() {
    const turn = this.turnStore.find(this.turn.id);
    if (!turn) throw new hostessUseCaseErrors.TurnNotFound();

    const hostess = this.hostessStore.find(this.hostess.id);
    if (!hostess) throw new hostessUseCaseErrors.HostessNotFound();

    if (!hostess.branch) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    }

    if (hostess.branch.id != turn.branch.id) {
      throw new hostessUseCaseErrors.BranchMissMatch();
    }

    turn.remove();
    return this.turnStore.update(turn);
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
  }
}

module.exports = HostessRemoveTurn;

const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');

class HostessServeTurn {
  constructor(hostess, turn, turnStore) {
    this.turn = turn;
    this.hostess = hostess;
    this.turnStore = turnStore;

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

    turn.serve(hostess.id);
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
  }
}

module.exports = HostessServeTurn;

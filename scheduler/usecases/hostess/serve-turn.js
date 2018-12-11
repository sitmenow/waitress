const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');

class HostessServeTurn {
  constructor(hostess, turn, turnStore, hostessStore, branchStore) {
    this.turn = turn;
    this.hostess = hostess;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    const turn = this.turnStore.find(this.turn.id);
    const branch = this.hostessStore.find(this.hostess.id)
      .then(hostess => this.branchStore.find(hostess.id));

    return Promise.all([turn, branch])
      .then(([turn, branch]) => this._createTurn(turn, branch))
      .catch(error => this._manageError(error));
  }

  _serveTurn(turn, branch) {
    if (!branch.isOpen()) {
      throw new hostessUseCaseErrors.BranchIsNotOpen();
    }

    if (branch.id != turn.branch.id) {
      throw new hostessUseCaseErrors.BranchMissMatch();
    }

    turn.serve();
    return this.turnStore.update(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    } else if (error instanceof storeErrors.TurnNotFound) {
      throw new hostessUseCaseErrors.TurnNotFound();
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
      throw new hostesUseCaseErrors.HostessStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new hostesUseCaseErrors.BranchStoreNotPresent();
    }
  }
}

module.exports = HostessServeTurn;

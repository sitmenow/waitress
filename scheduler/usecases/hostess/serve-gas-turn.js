const storeErrors = require('../../stores/errors');
const errors = require('./errors');


class HostessServeGasTurn {
  constructor({
    turnId,
    hostessId,
    turnStore,
    hostessStore,
    branchStore,
  }) {
    this.turnId = turnId;
    this.hostessId = hostessId;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
  }

  execute() {
    const turn = this.turnStore.find(this.turnId);
    const branch = this.hostessStore.find(this.hostessId)
      .then(hostess => this.branchStore.find(hostess.branch.id));

    return Promise.all([turn, branch])
      .then(([turn, branch]) => this._serveTurn(turn, branch))
      .catch(error => this._manageError(error));
  }

  _serveTurn(turn, branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.BranchMissMatch();
    }

    if (!turn.isWaiting()) {
      throw new errors.TurnIsNotWaiting();
    }

    // TODO: Manage turn serve error instead of above validation
    turn.serve();
    return this.turnStore.update(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.TurnNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof storeErrors.HostessNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.HostessDoesNotBelongToAnyBranch();
    } else if (error instanceof storeErrors.TurnNotUpdated) {
      throw new errors.TurnNotServed();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessServeGasTurn;

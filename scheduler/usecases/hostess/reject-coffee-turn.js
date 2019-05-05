const storeErrors = require('../../stores/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');

class HostessRejectCoffeeTurn {
  constructor({
    turnId,
    branchId,
    hostessId,
    turnStore,
    hostessStore,
    branchStore,
    turnCacheStore,
  }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
    this.turnCacheStore = turnCacheStore;
  }

  execute() {
    const turn = this.turnStore.find(this.turnId);
    const hostess = this.hostessStore.find(this.hostessId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._serveCoffeeTurns(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _serveCoffeeTurns(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    if (branch.isClosed()) {
      // This should be at use case error level
      throw new schedulerErrors.BranchIsClosed();
    }

    turn.reject();

    return this.turnStore.update(turn)
      .then(_ => this.turnCacheStore.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof storeErrors.HostessModelNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.HostessEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof storeErrors.TurnModelNotUpdated) {
      throw new errors.TurnNotUpdated();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessRejectCoffeeTurn;

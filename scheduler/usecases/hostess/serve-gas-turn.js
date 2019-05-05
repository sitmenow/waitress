const storeErrors = require('../../stores/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');

class HostessServeGasTurn {
  constructor({
    turnId,
    branchId,
    hostessId,
    turnStore,
    hostessStore,
    branchStore,
    cacheStore,
  }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.turnStore = turnStore;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
  }

  execute() {
    const turn = this.turnStore.find(this.turnId);
    const hostess = this.hostessStore.find(this.hostessId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._serveGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _serveGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    turn.serve();

    return Promise.all([
      this.turnStore.update(turn),
      this.cacheStore.removeGasTurn(turn.id)
    ]);
  }

  _manageError(error) {
    if (error instanceof storeErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof storeErrors.HostessModelNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.TurnModelNotUpdated) {
      throw new errors.TurnNotServed();
    } else if (error instanceof schedulerErrors.TurnNotAllowedToChangeStatus) {
      throw new errors.TurnNotServed();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessServeGasTurn;

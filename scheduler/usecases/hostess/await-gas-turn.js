const storeErrors = require('../../stores/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');


class HostessAwaitGasTurn {
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
      .then(([turn, hostess, branch]) => this._awaitGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _awaitGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    const expectedArrivalTime = new Date();
    return this.cacheStore.updateGasTurn(turn.id, expectedArrivalTime);
  }

  _manageError(error) {
    if (error instanceof storeErrors.TurnNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof storeErrors.HostessNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.TurnNotUpdated) {
      throw new errors.TurnNotServed();
    } else if (error instanceof schedulerErrors.TurnMustBeWaitingToBeServed) {
      throw new errors.UnableToServeTurn();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessAwaitGasTurn;

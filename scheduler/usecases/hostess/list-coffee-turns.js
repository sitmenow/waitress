const storeErrors = require('../../stores/errors');
const errors = require('./errors');

class HostessListCoffeeTurns {
  constructor({
    branchId,
    hostessId,
    hostessStore,
    branchStore,
    turnCacheStore,
    limit,
  }) {
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
    this.turnCacheStore = turnCacheStore;
    this.limit = limit || 25;
  }

  execute() {
    const hostess = this.hostessStore.find(this.hostessId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._listCoffeeTurns(hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _listCoffeeTurns(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    return await this.turnCacheStore.findByBranch(branch.id);
  }

  _manageError(error) {
    if (error instanceof storeErrors.HostessModelNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.HostessEntityNotCreated) {
      throw new Error();
    } else if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new Error();
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new Error();
    }

    throw error;
  }
}

module.exports = HostessListCoffeeTurns;

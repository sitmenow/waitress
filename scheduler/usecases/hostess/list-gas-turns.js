const storeErrors = require('../../stores/errors');
const errors = require('./errors');


class HostessListGasTurns {
  constructor({
    hostessId,
    hostessStore,
    branchStore,
    cacheStore,
  }) {
    this.hostessId = hostessId;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
  }

  execute() {
    return this.hostessStore.find(this.hostessId)
      .then(hostess => this.branchStore.find(hostess.branch.id))
      .then(branch => this._listGasTurns(branch))
      .catch(error => this._manageError(error));
  }

  _listGasTurns(branch) {
    return this.cacheStore.getBranchGasTurns(branch.id);
  }

  _manageError(error) {
    if (error instanceof storeErrors.HostessNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.HostessDoesNotBelongToAnyBranch();
    }

    console.log(error);
    throw error;
  }
}

module.exports = HostessListGasTurns;

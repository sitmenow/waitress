const storeErrors = require('../../stores/errors');
const errors = require('./errors');


class HostessToggleGasStation {
  constructor({
    hostessId,
    branchId,
    hostessStore,
    branchStore,
  }) {
    this.hostessId = hostessId;
    this.branchId = branchId;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
  }

  execute() {
    const hostess = this.hostessStore.find(this.hostessId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._toggleGasStation(hostess, branch))
      .catch(error => this._manageError(error));
  }

  _toggleGasStation(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.isOpen()) {
      branch.close();
    } else {
      branch.open();
    }

    return this.branchStore.update(branch);
  }

  _manageError(error) {
    if (error instanceof storeErrors.HostessNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessToggleGasStation;

const {
  BranchModelNotFound,
  HostessModelNotFound } = require('./database/errors');
const { BranchNotFound, HostessNotFound } = require('./hostess-errors');

class HostessTogglesGasStation {
  constructor({ hostessId, branchId, database }) {
    this.hostessId = hostessId;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const hostess = this.database.hostesses.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._toggleGasStation(hostess, branch))
      .catch(error => this._manageError(error));
  }

  _toggleGasStation(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    if (branch.isOpen()) {
      branch.close();
    } else {
      branch.open();
    }

    return this.database.branches.update(branch);
  }

  _manageError(error) {
    if (error instanceof HostessModelNotFound) {
       throw new HostessNotFound(error.modelId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    }

    throw error;
  }
}

module.exports = HostessTogglesGasStation;

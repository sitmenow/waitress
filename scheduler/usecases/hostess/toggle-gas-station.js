const databaseErrors = require('../../database/errors');
const errors = require('./errors');


class HostessToggleGasStation {
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
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.isOpen()) {
      branch.close();
    } else {
      branch.open();
    }

    return this.database.branches.update(branch);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.HostessNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof databaseErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessToggleGasStation;

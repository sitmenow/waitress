const databaseErrors = require('../../database/errors');
const errors = require('./errors');

class HostessListCoffeeTurns {
  constructor({ branchId, hostessId, database, limit }) {
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
    this.limit = limit || 25;
  }

  execute() {
    const hostess = this.database.hostesses.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._listCoffeeTurns(hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _listCoffeeTurns(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    return await this.database.turnsCache.findByBranch(branch.id);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.HostessModelNotFound) {
       throw new errors.HostessNotFound(this.hostessId);
    } else if (error instanceof databaseErrors.HostessEntityNotCreated) {
      throw new Error();
    } else if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof databaseErrors.BranchEntityNotCreated) {
      throw new Error();
    } else if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new Error();
    }

    throw error;
  }
}

module.exports = HostessListCoffeeTurns;

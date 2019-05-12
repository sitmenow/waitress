const errors = require('./errors');
const databaseErrors = require('../../database/errors');


class CustomerDetailGasStation {
  constructor({ branchId, database }) {
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    return this.database.branches.find(this.branchId)
      .then(branch => this._detailGasStation(branch))
      .catch(error => this._manageError(error));
  }

  async _detailGasStation(branch) {
    const turns = await this.database.cache.getBranchGasTurns(branch.id);

    branch.waitingTurns = turns.length;

    return branch;
  }

  _manageError(error) {
    if (error instanceof databaseErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof databaseErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerDetailGasStation;

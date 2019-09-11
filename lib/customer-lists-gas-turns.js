const errors = require('./errors');
const databaseErrors = require('../../database/errors');


class CustomerListGasTurns {
  constructor({ branchId, database, limit }) {
    this.branchId = branchId;
    this.database = database;
    this.limit = limit || 25;
  }

  execute() {
    return this.database.branches.find(this.branchId)
      .then(branch => this._listGasTurns(branch))
      .catch(error => this._manageError(error));
  }

  async _listGasTurns(branch) {
    const cache = await this.database.cache.getBranchGasTurns(branch.id, this.limit);
    const turns = cache.map(item => this.database.turns.find(item.id));

    return Promise.all(turns);
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

module.exports = CustomerListGasTurns;

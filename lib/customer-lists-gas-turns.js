const { BranchNotFound, CorruptedBranch } = require('./customer-errors');
const {
  BranchModelNotFound,
  BranchEntityNotCreated } = require('./database/errors');

class CustomerListsGasTurns {
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
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerListsGasTurns;

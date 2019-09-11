const { BranchNotFound, CorruptedBranch } = require('./errors');
const {
  BranchModelNotFound,
  BranchEntityNotCreated } = require('./database/errors');

class CustomerDetailsGasStation {
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
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    }

    throw error;
  }
}

module.exports = CustomerDetailsGasStation;

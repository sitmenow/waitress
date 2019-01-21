const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerDetailGasStation {
  constructor({
    branchId,
    branchStore,
    cacheStore,
  }) {
    this.branchId = branchId;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
  }

  execute() {
    return this.branchStore.find(this.branchId)
      .then(branch => this._detailGasStation(branch))
      .catch(error => this._manageError(error));
  }

  async _detailGasStation(branch) {
    const turns = await this.cacheStore.getBranchGasTurns(branch.id);

    branch.waitingTurns = turns.length;

    return branch;
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerDetailGasStation;

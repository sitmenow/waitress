const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerDetailGasStation {
  constructor({
    branchId,
    branchStore,
    turnStore,
  }) {
    this.branchId = branchId;
    this.branchStore = branchStore;
    this.turnStore = turnStore;
  }

  execute() {
    return this.branchStore.find(this.branchId)
      .then(branch => this._detailGasStation(branch))
      .catch(error => this._manageError(error));
  }

  async _detailGasStation(branch) {
    //if (!branch.isOpen()) {
    //  throw new errors.BranchIsNotOpen();
    //}

    const turns = await this.turnStore.findByBranchAndStatus(
      branch.id,
      branch.lastOpeningTime,
      'waiting'
    );

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

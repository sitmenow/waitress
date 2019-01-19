const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerListGasTurns {
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
      .then(branch => this._listGasTurns(branch))
      .catch(error => this._manageError(error));
  }

  _listGasTurns(branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    return this.turnStore.findByBranchAndStatus(
      branch.id,
      branch.lastOpeningTime,
      'waiting'
    );
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

module.exports = CustomerListGasTurns;

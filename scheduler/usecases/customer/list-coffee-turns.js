const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerListCoffeeTurns {
  constructor({ branchId, branchStore, turnStore } = {}) {
    this.branchId = branchId;
    this.branchStore = branchStore;
    this.turnStore = turnStore;
  }

  execute() {
    return this.branchStore.find(this.branchId)
      .then(branch => this._listCoffeeTurns(branch))
      .catch(error => this._manageError(error));
  }

  async _listCoffeeTurns(branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsClosed(branch.id, branch.lastClosingTime);
    }

    const turns = await this.turnStore.findWaitingByBranchAndRequestedTimeRange(
      branch.id, branch.lastOpeningTime, null
    );

    return turns;
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(branch.id);
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.BranchNotCreated(branch.id);
    }

    throw error;
  }
}

module.exports = CustomerListCoffeeTurns;

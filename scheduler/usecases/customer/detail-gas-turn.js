const Turn = require('../../turn');
const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerDetailGasTurn {
  constructor({
    turnId,
    branchId,
    turnStore,
    branchStore,
    cacheStore,
  }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
  }

  execute() {
    const branch = this.branchStore.find(this.branchId);
    const turn = this.turnStore.find(this.turnId);

    return Promise.all([branch, turn])
      .then(([branch, turn]) => this._detailGasTurn(branch, turn))
      .catch(error => this._manageError(error));
  }

  async _detailGasTurn(branch, turn) {
    // Doesn't care if branch is open/closed. The turn detail
    // should be available always. Maybe gas station was closed
    // to stop receiving turns
    const turns = await this.cacheStore.getBranchGasTurns(branch.id);

    if (!turn.isServed()) {
      turn.position = turns.length
    }
    return turn;
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    }

    throw error;
  }
}

module.exports = CustomerDetailGasTurn;

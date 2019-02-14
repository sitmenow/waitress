const errors = require('./errors');
const storeErrors = require('../../stores/errors');
const Turn = require('../../turn');
const Customer = require('../../customer');


class CustomerCancelCoffeeTurn {
  constructor({ turnId, branchId, turnStore, branchStore }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
  }

  execute() {
    const turn = this.turnStore.find(this.turnId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([turn, branch])
      .then(([turn, branch]) => this._cancelCoffeeTurn(turn, branch))
      .catch(error => this._manageError(error));
  }

  _cancelCoffeeTurn(turn, branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsClosed(branch.id, branch.lastOpeningTime);
    }

    turn.cancel();

    return this.turnStore.update(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.BranchNotCreated(this.branchId);
    } else if (error instanceof storeErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound(this.turnId);
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotCreated();
    }

    throw error;
  }
}

module.exports = CustomerCancelCoffeeTurn;

const Turn = require('./turn');
const { BranchNotFound, CustomerNotFound } = require('./errors');
const {
  BranchModelNotFound,
  CustomerModelNotFound } = require('./database/errors');


class CustomerDetailsGasTurn {
  constructor({ turnId, branchId, database}) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const branch = this.database.branches.find(this.branchId);
    const turn = this.database.turns.find(this.turnId);

    return Promise.all([branch, turn])
      .then(([branch, turn]) => this._detailGasTurn(branch, turn))
      .catch(error => this._manageError(error));
  }

  async _detailGasTurn(branch, turn) {
    // Doesn't care if branch is open/closed. The turn detail
    // should be available always. Maybe gas station was closed
    // to stop receiving turns
    const turns = await this.database.cache.getBranchGasTurns(branch.id);

    if (!turn.isServed()) {
      turn.position = turns.length
    }
    return turn;
  }

  _manageError(error) {
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    }

    throw error;
  }
}

module.exports = CustomerDetailsGasTurn;

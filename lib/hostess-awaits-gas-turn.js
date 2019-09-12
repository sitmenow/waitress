const {
  TurnModelNotFound,
  HostessModelNotFound,
  BranchModelNotFound } = require('./database/errors');
const {
  TurnNotFound,
  HostessNotFound,
  BranchNotFound } = require('./errors');

class HostessAwaitsGasTurn {
  constructor({ turnId, branchId, hostessId, database }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const hostess = this.database.hostess.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._awaitGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _awaitGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    if (branch.id != turn.branch.id) {
      throw new TurnNotFound(turn.id);
    }

    const expectedArrivalTime = new Date();
    return this.database.cache.updateGasTurn(turn.id, expectedArrivalTime)
      .then(() => {
        turn.expectedArrivalTime = expectedArrivalTime;
        return turn;
      });
  }

  _manageError(error) {
    if (error instanceof TurnModelNotFound) {
      throw new TurnNotFound(error.modelId);
    } else if (error instanceof HostessModelNotFound) {
      throw new HostessNotFound(error.modelId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    }

    throw error;
  }
}

module.exports = HostessAwaitsGasTurn;

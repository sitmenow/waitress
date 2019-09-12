const {
  TurnModelNotFound,
  BranchModelNotFound,
  HostessModelNotFound } = require('./database/errors');
const { TurnNotFound, BranchNotFound, HostessNotFound } = require('./errors');

class HostessServesGasTurn {
  constructor({ turnId, branchId, hostessId, database }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const hostess = this.database.hostesses.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._serveGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _serveGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    if (branch.id != turn.branch.id) {
      throw new TurnNotFound(turn.id);
    }

    turn.serve();

    return Promise.all([
      this.database.turns.update(turn),
      this.database.cache.removeGasTurn(turn.id)
    ]);
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

module.exports = HostessServesGasTurn;

const {
  BranchModelNotFound,
  HostessModelNotFound,
  TurnModelNotFound,
  BranchEntityNotCreated,
  HostessEntityNotCreated,
  TurnEntityNotCreated } = require('./database/errors');
const {
  BranchNotFound,
  HostessNotFound,
  TurnNotFound,
  BranchNotAvailable,
  CorruptedBranch,
  CorruptedHostess,
  CorruptedTurn } = require('./errors');

class HostessServesCoffeeTurn {
  constructor({ turnId, branchId, userId, database }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.userId = userId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const hostess = this.database.hostesses.findByUserId(this.userId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._serveCoffeeTurns(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _serveCoffeeTurns(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    if (branch.id != turn.branch.id) {
      throw new TurnNotFound(turn.id);
    }

    if (branch.isClosed()) {
      throw new BranchNotAvailable(branch.id);
    }

    turn.serve();
    // In reservations: Cancel all other active turns
    // for this customer

    return this.database.turns.update(turn)
      .then(_ => this.database.turnsCache.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof TurnModelNotFound) {
      throw new TurnNotFound(error.modelId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    } else if (error instanceof HostessModelNotFound) {
      throw new HostessNotFound(error.modelId);
    } else if (error instanceof HostessEntityNotCreated) {
      throw new CorruptedHostess(error.entityId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    }

    throw error;
  }
}

module.exports = HostessServesCoffeeTurn;

const {
  HostessModelNotFound,
  BranchModelNotFound,
  HostessEntityNotCreated,
  BranchEntityNotCreated,
  TurnEntityNotCreated } = require('./database/errors');
const {
  HostessNotFound,
  BranchNotFound,
  CorruptedHostess,
  CorruptedBranch,
  CorruptedTurn } = require('./errors');

class HostessListsCoffeeTurns {
  constructor({ userId, branchId, database, limit }) {
    this.userId = userId;
    this.branchId = branchId;
    this.database = database;
    this.limit = limit || 25;
  }

  execute() {
    const hostess = this.database.hostesses.findByUserId(this.userId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._listCoffeeTurns(hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _listCoffeeTurns(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    return await this.database.turnsCache.findByBranch(branch.id);
  }

  _manageError(error) {
    if (error instanceof HostessModelNotFound) {
       throw new HostessNotFound(error.modelId);
    } else if (error instanceof HostessEntityNotCreated) {
      throw new CorruptedHostess(error.entityId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }

    throw error;
  }
}

module.exports = HostessListsCoffeeTurns;

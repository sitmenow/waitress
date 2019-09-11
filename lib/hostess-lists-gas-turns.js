const {
  HostessModelNotFound,
  BranchModelNotFound } = require('./database/errors');
const { HostessNotFound, BranchNotFound } = require('./errors');

class HostessListsGasTurns {
  constructor({ branchId, hostessId, database, limit }) {
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
    this.limit = limit || 25;
  }

  execute() {
    const hostess = this.database.hostesses.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._listGasTurns(hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _listGasTurns(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new BranchNotFound(branch.id);
    }

    const cache = await this.database.cache.getBranchGasTurns(branch.id, this.limit);
    const turns = cache.map(item =>
      this.database.turns.find(item.id).then((turn) => {
        turn.expectedArrivalTime = item.expectedArrivalTime;
        return turn;
      })
    );

    return Promise.all(turns);
  }

  _manageError(error) {
    if (error instanceof HostessModelNotFound) {
       throw new HostessNotFound(error.modelId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    }

    throw error;
  }
}

module.exports = HostessListsGasTurns;

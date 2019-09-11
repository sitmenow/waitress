const databaseErrors = require('./database/errors');
const errors = require('./hostess-errors');


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
      throw new errors.HostessDoesNotBelongToBranch();
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
    if (error instanceof databaseErrors.HostessModelNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessListsGasTurns;

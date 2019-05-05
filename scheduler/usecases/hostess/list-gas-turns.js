const storeErrors = require('../../stores/errors');
const errors = require('./errors');


class HostessListGasTurns {
  constructor({
    branchId,
    hostessId,
    hostessStore,
    branchStore,
    cacheStore,
    turnStore,
    limit,
  }) {
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
    this.turnStore = turnStore;
    this.limit = limit || 25;
  }

  execute() {
    const hostess = this.hostessStore.find(this.hostessId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([hostess, branch])
      .then(([hostess, branch]) => this._listGasTurns(hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _listGasTurns(hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    const cache = await this.cacheStore.getBranchGasTurns(branch.id, this.limit);
    const turns = cache.map(item =>
      this.turnStore.find(item.id).then((turn) => {
        turn.expectedArrivalTime = item.expectedArrivalTime;
        return turn;
      })
    );

    return Promise.all(turns);
  }

  _manageError(error) {
    if (error instanceof storeErrors.HostessModelNotFound) {
       throw new errors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessListGasTurns;

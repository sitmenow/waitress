const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerListGasTurns {
  constructor({
    branchId,
    branchStore,
    cacheStore,
    turnStore,
    limit,
  }) {
    this.branchId = branchId;
    this.branchStore = branchStore;
    this.cacheStore = cacheStore;
    this.turnStore = turnStore;
    this.limit = limit || 25;
  }

  execute() {
    return this.branchStore.find(this.branchId)
      .then(branch => this._listGasTurns(branch))
      .catch(error => this._manageError(error));
  }

  async _listGasTurns(branch) {
    const cache = await this.cacheStore.getBranchGasTurns(branch.id, this.limit);
    const turns = cache.map(item => this.turnStore.find(item.id));

    return Promise.all(turns);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerListGasTurns;

const errors = require('./errors');
const storeErrors = require('../../stores/errors');

class CustomerDetailCoffeeBranch {
  constructor({
    customerId, branchId, turnCacheStore, branchStore, customerStore
  } = {}) {
    this.customerId = customerId;
    this.branchId = branchId;
    this.turnCacheStore = turnCacheStore;
    this.branchStore = branchStore;
    this.customerStore = customerStore;
  }

  execute() {
    const branch = this.branchStore.find(this.branchId);
    const customer = this.customerStore.find(this.customerId);

    return Promise.all([branch, customer])
      .then(([branch, customer]) => this._detailBranch(branch, customer))
      .catch(error => this._manageError(error));
  }

  _detailBranch(branch, customer) {
    /*
     * Branch X has N active turns and you currently have M waiting turns there!
    */
    return this.turnCacheStore.findByBranch(branch.id)
      .then((turns) => ({
        ...branch,
        waitingTurns: turns.length,
        customerTurns: turns.filter(turn => turn.customer.id == customer.id),
        averageWaitingTime: null,
      }));
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    }
    if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof storeErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    }
    if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }

    throw error;
  }
}

module.exports = CustomerDetailCoffeeBranch;

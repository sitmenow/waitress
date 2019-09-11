const errors = require('./errors');
const databaseErrors = require('../../database/errors');

class CustomerDetailCoffeeBranch {
  constructor({ customerId, branchId, database } = {}) {
    this.customerId = customerId;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const branch = this.database.branches.find(this.branchId);
    const customer = this.database.customers.find(this.customerId);

    return Promise.all([branch, customer])
      .then(([branch, customer]) => this._detailBranch(branch, customer))
      .catch(error => this._manageError(error));
  }

  _detailBranch(branch, customer) {
    /*
     * Branch X has N active turns and you currently have M waiting turns there!
    */
    return this.database.turnsCache.findByBranch(branch.id)
      .then((turns) => ({
        ...branch,
        waitingTurns: turns.length,
        customerTurns: turns.filter(turn => turn.customer.id == customer.id),
        averageWaitingTime: null,
      }));
  }

  _manageError(error) {
    if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    }
    if (error instanceof databaseErrors.BranchEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof databaseErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    }
    if (error instanceof databaseErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }
    if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new errors.CustomerUseCaseError(); // Unknown error
    }

    throw error;
  }
}

module.exports = CustomerDetailCoffeeBranch;

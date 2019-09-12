const {
  BranchNotFound,
  CustomerNotFound,
  CorruptedCustomer,
  CorruptedBranch,
  CorruptedTurn } = require('./errors');
const {
  CustomerModelNotFound,
  BranchModelNotFound,
  CustomerEntityNotCreated,
  BranchEntityNotCreated,
  TurnEntityNotCreated } = require('./database/errors');

class CustomerDetailsCoffeeBranch {
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
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    }
    if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    }
    if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    }
    if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    }
    if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }

    throw error;
  }
}

module.exports = CustomerDetailsCoffeeBranch;

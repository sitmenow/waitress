const errors = require('./errors');
const storeErrors = require('../../stores/errors');
const schedulerErrors = require('../../errors');
const Turn = require('../../turn');
const Customer = require('../../customer');

class CustomerCancelCoffeeTurn {
  constructor({
    turnId,
    customerId,
    branchId,
    turnStore,
    turnCacheStore,
    customerStore,
    branchStore
  }) {
    this.turnId = turnId;
    this.customerId = customerId;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.turnCacheStore = turnCacheStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;
  }

  execute() {
    const turn = this.turnStore.find(this.turnId);
    const customer = this.customerStore.find(this.customerId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([turn, customer, branch])
      .then(([turn, customer, branch]) =>
        this._cancelCoffeeTurn(turn, customer, branch)
      )
      .catch(error => this._manageError(error));
  }

  _cancelCoffeeTurn(turn, customer, branch) {
    if (turn.customer.id != customer.id) {
      throw new errors.TurnDoesNotBelongToCustomer();
    }

    if (branch.isClosed()) {
      throw new errors.BranchIsClosed(branch.id, branch.lastOpeningTime);
    }

    turn.cancel();

    return this.turnStore.update(turn)
      .then(_ => this.turnCacheStore.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotUpdated(this.turnId);
    } else if (error instanceof storeErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    } else if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof storeErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound(this.turnId);
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotUpdated(); // Actually this is an unknown error
    } else if (error instanceof storeErrors.TurnModelNotCreated) {
      throw new errors.TurnNotUpdated();
    }

    throw error;
  }
}

module.exports = CustomerCancelCoffeeTurn;

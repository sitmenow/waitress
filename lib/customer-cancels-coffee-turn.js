const errors = require('./errors');
const databaseErrors = require('../../database/errors');
const schedulerErrors = require('../../errors');
const Turn = require('../../turn');
const Customer = require('../../customer');

class CustomerCancelCoffeeTurn {
  constructor({ turnId, customerId, branchId, database }) {
    this.turnId = turnId;
    this.customerId = customerId;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const customer = this.database.customers.find(this.customerId);
    const branch = this.database.branches.find(this.branchId);

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

    return this.database.turns.update(turn)
      .then(_ => this.database.turnsCache.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof databaseErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotUpdated(this.turnId);
    } else if (error instanceof databaseErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    } else if (error instanceof databaseErrors.CustomerEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof databaseErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound(this.turnId);
    } else if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotUpdated(); // Actually this is an unknown error
    } else if (error instanceof databaseErrors.TurnModelNotCreated) {
      throw new errors.TurnNotUpdated();
    }

    throw error;
  }
}

module.exports = CustomerCancelCoffeeTurn;

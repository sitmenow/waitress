const Turn = require('./turn');
const Customer = require('./customer');
const {
  BranchNotFound, CustomerNotFound, TurnNotFound, TurnNotUpdated,
  TurnDoesNotBelongToCustomer, BranchIsClosed,
} = require('./customer-errors');
const {
  BranchModelNotFound, BranchEntityNotCreated, CustomerModelNotFound,
  CustomerEntityNotCreated, TurnModelNotFound, TurnEntityNotCreated,
  TurnModelNotCreated,
} = require('./database/errors');

class CustomerCancelsCoffeeTurn {
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
      throw new TurnDoesNotBelongToCustomer();
    }

    if (branch.isClosed()) {
      throw new BranchIsClosed(branch.id, branch.lastOpeningTime);
    }

    turn.cancel();

    return this.database.turns.update(turn)
      .then(_ => this.database.turnsCache.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(this.branchId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new TurnNotUpdated(this.turnId);
    } else if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(this.customerId);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new TurnNotUpdated();
    } else if (error instanceof TurnModelNotFound) {
      throw new TurnNotFound(this.turnId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new TurnNotUpdated(); // Actually this is an unknown error
    } else if (error instanceof TurnModelNotCreated) {
      throw new TurnNotUpdated();
    }

    throw error;
  }
}

module.exports = CustomerCancelsCoffeeTurn;

const Turn = require('./turn');
const Customer = require('./customer');
const {
  BranchNotFound,
  CustomerNotFound,
  TurnNotFound,
  CorruptedTurn,
  BranchNotAvailable,
  CorruptedBranch,
  CorruptedCustomer,
  CustomerCancelsCoffeeTurnError } = require('./errors');
const {
  BranchModelNotFound,
  BranchEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  TurnModelNotFound,
  TurnEntityNotCreated } = require('./database/errors');

class CustomerCancelsCoffeeTurn {
  constructor({ turnId, userId, branchId, database }) {
    this.turnId = turnId;
    this.userId = userId;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const customer = this.database.customers.findByUserId(this.userId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, customer, branch])
      .then(([turn, customer, branch]) =>
        this._cancelCoffeeTurn(turn, customer, branch)
      )
      .catch(error => this._manageError(error));
  }

  _cancelCoffeeTurn(turn, customer, branch) {
    if (turn.customer.id != customer.id) {
      throw new TurnNotFound(turn.id);
    }

    if (branch.isClosed()) {
      throw new BranchNotAvailable(branch.id);
    }

    turn.cancel();

    return this.database.turns.update(turn)
      .then(_ => this.database.turnsCache.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    } else if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    } else if (error instanceof TurnModelNotFound) {
      throw new TurnNotFound(error.modelId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }
    /*
    else if (error instanceof TurnModelNotCreated) {
      throw new TurnNotUpdated();
    }
    */

    throw error;
  }
}

module.exports = CustomerCancelsCoffeeTurn;

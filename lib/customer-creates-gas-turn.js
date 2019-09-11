const mongoose = require('mongoose');

const Turn = require('./turn');
const Customer = require('./customer');
const {
  BranchNotAvailable,
  InvalidTurn,
  BranchNotFound,
  CustomerNotFound,
  CorruptedBranch,
  CorruptedCustomer,
  CorruptedTurn } = require('./errors');
const {
  CustomerModelNotFound,
  BranchModelNotFound,
  CustomerEntityNotCreated,
  BranchEntityNotCreated } = require('./database/errors');

class CustomerCreatesGasTurn {
  constructor({ turnEmailAddress, turnName, turnPlates, branchId, database }) {
    this.turnName = turnName;
    this.turnEmailAddress = turnEmailAddress;
    this.turnPlates = turnPlates;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    return this.database.branches.find(this.branchId)
      .then(branch => this._createTurn(branch))
      // update sockets!
      .catch(error => this._manageError(error));
  }

  _createTurn(branch) {
    if (!branch.isOpen()) {
      throw new BranchNotAvaliable(branch.id);
    }

    if (!this.turnName && !this.turnEmailAddress) {
      throw new InvalidTurn('new', 'identifier cannot be empty');
    }

    if (!this.turnPlates) {
      throw new InvalidTurn('new', 'plates cannot be empty');
    }

    const turn = new Turn({
      name: this.turnName,
      branch: branch,
      customer: new Customer({ id: mongoose.Types.ObjectId() }),
    });

    turn.emailAddress = this.turnEmailAddress;
    turn.plates = this.turnPlates;

    return this.database.turns.create(turn)
      .then(turnId => this.database.cache.createGasTurn(turnId, branch.id));
  }

  _manageError(error) {
    if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }

    throw error;
  }
}

module.exports = CustomerCreatesGasTurn;

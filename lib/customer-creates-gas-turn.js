const mongoose = require('mongoose');

const Turn = require('./turn');
const Customer = require('./customer');
const errors = require('./customer-errors');
const databaseErrors = require('./database/errors');


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
      throw new errors.BranchIsNotOpen();
    }

    if (!this.turnName && !this.turnEmailAddress) {
      throw new errors.TurnRequiresIdentifier();
    }

    if (!this.turnPlates) {
      throw new errors.TurnRequiresPlates();
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
    if (error instanceof databaseErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof databaseErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    } else if (error instanceof databaseErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    } else if (error instanceof databaseErrors.CustomerNotCreated) {
      throw new errors.CustomerNotCreated();
    } else if (error instanceof databaseErrors.TurnNotCreated) {
      throw new errors.TurnNotCreated();
    }

    throw error;
  }
}

module.exports = CustomerCreatesGasTurn;

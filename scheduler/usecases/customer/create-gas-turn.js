const mongoose = require('mongoose');
const Turn = require('../../turn');
const Customer = require('../../customer');
const errors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerCreateGasTurn {
  constructor({
    turnEmailAddress,
    turnName,
    turnPlates,
    branchId,
    turnStore,
    branchStore,
  }) {
    this.turnName = turnName;
    this.turnEmailAddress = turnEmailAddress;
    this.turnPlates = turnPlates;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
  }

  execute() {
    return this.branchStore.find(this.branchId)
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

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    } else if (error instanceof storeErrors.CustomerNotCreated) {
      throw new errors.CustomerNotCreated();
    } else if (error instanceof storeErrors.TurnNotCreated) {
      throw new errors.TurnNotCreated();
    }

    throw error;
  }
}

module.exports = CustomerCreateGasTurn;

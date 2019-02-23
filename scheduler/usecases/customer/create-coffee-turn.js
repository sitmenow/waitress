const mongoose = require('mongoose');

const errors = require('./errors');
const storeErrors = require('../../stores/errors');
const Turn = require('../../turn');
const Customer = require('../../customer');


class CustomerCreateCoffeeTurn {
  constructor({
    customerName,
    customerCompany,
    customerElection,
    branchId,
    turnStore,
    branchStore,
  }) {
    this.customerName = customerName;
    this.customerCompany = customerCompany;
    this.customerElection = customerElection;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
  }

  execute() {
    return this.branchStore.find(this.branchId)
      .then(branch => this._createCoffeeTurn(branch))
      .catch(error => this._manageError(error));
  }

  _createCoffeeTurn(branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsClosed(branch.id, branch.lastOpeningTime);
    }

    if (!this.customerName) {
      throw new errors.InvalidCustomerName(this.customerName);
    }

    if (!this.customerElection) {
      throw new errors.InvalidCustomerElection(
        this.customerName, this.customerElection
      );
    }

    const turn = new Turn({
      branch,
      name: this.customerName,
      customer: new Customer({
        id: mongoose.Types.ObjectId(),
        name: this.customerName,
      }),
      metadata: {
        company: this.customerCompany,
        election: this.customerElection,
      },
    });

    return this.turnStore.create(turn);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.BranchNotCreated(this.branchId);
    } else if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.CustomerNotCreated(this.customerId);
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotCreated(); // Turn Id does not exist :thinking:
    }

    throw error;
  }
}

module.exports = CustomerCreateCoffeeTurn;

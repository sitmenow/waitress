const mongoose = require('mongoose');

const errors = require('./errors');
const storeErrors = require('../../stores/errors');
const Turn = require('../../turn');
const Customer = require('../../customer');

class CustomerCreateCoffeeTurn {
  constructor({
    customerId,
    customerCompany,
    customerElection,
    branchId,
    turnStore,
    turnCacheStore,
    customerStore,
    branchStore,
  }) {
    this.customerId = customerId;
    this.customerCompany = customerCompany;
    this.customerElection = customerElection;
    this.branchId = branchId;
    this.turnStore = turnStore;
    this.turnCacheStore = turnCacheStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;
  }

  execute() {
    const customer = this.customerStore.find(this.customerId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._createCoffeeTurn(customer, branch))
      .catch(error => this._manageError(error));
  }

  _createCoffeeTurn(customer, branch) {
    if (branch.isClosed()) {
      throw new errors.BranchIsClosed(branch.id, branch.lastOpeningTime);
    }

    if (!customer.name) {
      throw new errors.InvalidCustomerName(customer.id);
    }

    if (!this.customerElection) {
      throw new errors.InvalidCustomerElection(
        this.customerName, this.customerElection
      );
    }

    const turn = new Turn({
      branch,
      customer,
      name: customer.name,
      metadata: {
        company: this.customerCompany,
        product: this.customerElection,
      },
    });

    return this.turnStore.create(turn)
      .then(turnId => this.turnStore.find(turnId))
      .then(storedTurn =>
        this.turnCacheStore.create(storedTurn)
          .then(_ => storedTurn)
      );
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof storeErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof storeErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    } else if (error instanceof storeErrors.CustomerEntityNotCreated) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof storeErrors.TurnModelNotFound) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof storeErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotCreated(); // Unknown error
    } else if (error instanceof storeErrors.TurnModelNotCreated) {
      throw new errors.TurnNotCreated(); // Unknown error if comes from turn cache
    }

    throw error;
  }
}

module.exports = CustomerCreateCoffeeTurn;

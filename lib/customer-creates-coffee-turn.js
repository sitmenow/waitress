const mongoose = require('mongoose');

const errors = require('./errors');
const databaseErrors = require('../../database/errors');
const Turn = require('../../turn');
const Customer = require('../../customer');

class CustomerCreateCoffeeTurn {
  constructor({
    customerId, customerCompany, customerElection, branchId, database,
  }) {
    this.customerId = customerId;
    this.customerCompany = customerCompany;
    this.customerElection = customerElection;
    this.branchId = branchId;
    this.database = database;
  }

  execute() {
    const customer = this.database.customers.find(this.customerId);
    const branch = this.database.branches.find(this.branchId);

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

    return this.database.turns.create(turn)
      .then(turnId => this.database.turns.find(turnId))
      .then(storedTurn =>
        this.database.turnsCache.create(storedTurn)
          .then(_ => storedTurn)
      );
  }

  _manageError(error) {
    if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound(this.branchId);
    } else if (error instanceof databaseErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof databaseErrors.CustomerModelNotFound) {
      throw new errors.CustomerNotFound(this.customerId);
    } else if (error instanceof databaseErrors.CustomerEntityNotCreated) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof databaseErrors.TurnModelNotFound) {
      throw new errors.TurnNotCreated();
    } else if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotCreated(); // Unknown error
    } else if (error instanceof databaseErrors.TurnModelNotCreated) {
      throw new errors.TurnNotCreated(); // Unknown error if comes from turn cache
    }

    throw error;
  }
}

module.exports = CustomerCreateCoffeeTurn;

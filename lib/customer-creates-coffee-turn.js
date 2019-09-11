const mongoose = require('mongoose');

const Turn = require('./turn');
const Customer = require('./customer');
const {
  BranchNotAvailable,
  InvalidTurn,
  BranchNotFound,
  TurnNotFound,
  CustomerNotFound,
  CorruptedCustomer,
  CorruptedTurn,
  CorruptedBranch,
  CustomerCreatesCoffeeTurnError } = require('./errors');
const {
  BranchModelNotFound,
  BranchEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  TurnModelNotFound,
  TurnEntityNotCreated } = require('./database/errors');

class CustomerCreatesCoffeeTurn {
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
      throw new BranchNotAvailable(branch.id);
    }

    if (!customer.name) {
      throw new InvalidTurn('new', 'name cannot be empty');
    }

    if (!this.customerElection) {
      throw new InvalidTurn('new', 'election cannot be empty');
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
      throw new TurnNotCreated(); // Unknown error if comes from turn cache
    }
    */

    throw error;
  }
}

module.exports = CustomerCreatesCoffeeTurn;

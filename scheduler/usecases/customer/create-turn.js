const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');

class CustomerCreateTurn {
  constructor(customer, turn, branch, turnStore, customerStore, branchStore) {
    this.turn = turn;
    this.branch = branch;
    this.customer = customer;
    this.turnStore = turnStore;
    this.branchStore = branchStore;
    this.customerStore = customerStore;

    this._validate();
  }

  execute() {
    const branch = this.branchStore.find(this.branch.id);
    if (!branch) throw new customerUseCaseErrors.BranchNotFound();

    const customer = this.customerStore.find(this.customer.id);
    if (!customer) throw new customerUseCaseErrors.CustomerNotFound();

    if (!branch.opened(this.turn.date)) {
      throw new customerUseCaseErrors.BranchIsNotOpen();
    }
    this.turn.name = customer.name;
    // TODO: Validate date
    this.turn.date = this.turn.date || new Date();
    this.turn.customer = customer;
    this.turn.branch = branch;

    return this.turnStore.create(this.turn);
  }

  _validate() {
    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new customerUseCaseErors.CustomerStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new customerUseCaseErrors.BranchStoreNotPresent();
    }

    if (!this.branch) {
      throw new customerUseCaseErrors.BranchNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }

    if (!this.turn) {
      throw new customerUseCaseErrors.TurnNotPresent();
    }
  }
}

module.exports = CustomerCreateTurn;

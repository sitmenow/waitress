const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');

class CustomerDetailTurn {
  constructor(customer, turn, customerStore, turnStore, branchStore) {
    this.turn = turn;
    this.customer = customer;
    this.turnStore = turnStore;
    this.customerStore = customerStore;
    this.branchStore = branchStore;
  }

  execute() {
    const customer = this.customerStore.find(this.customer.id);
    if (!customer) throw new customerUseCaseErrors.CustomerNotFound();

    const turn = this.turnStore.find(this.turn.id);
    if (!turn) throw new customerUseCaseErrors.TurnNotFound();

    if (customer.id != turn.customer.id) {
      throw new customerUseCaseErrors.TurnDoesNotBelongToCustomer();
    }

    const branch = this.branchStore.find(this.turn.branch.id);

    if (branch.id != turn.branch.id) {
      throw new customerUseCaseErrors.UnableToChangeTurnsBranch();
    }

    if (!branch.opened(this.turn.date)) {
      turn.date = this.turn.date;
    }

    turn.name = this.turn.name;
    return this.turnStore.update(turn);
  }

  _validate() {
    if (!this.turn) {
      throw new customerUseCaseErrors.TurnNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }

    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }

    if (!this.customerStore) {
      throw new customerUseCaseErrors.CustomerStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new customerUseCaseErrors.BranchStoreNotPresent();
    }
  }
}

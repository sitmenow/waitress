const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');


class CustomerListTurns {
  constructor(customer, branch, index, branchStore) {
    this.index = index;
    this.branch = branch;
    this.customer = customer;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    const branch = this.branchStore.find(this.branch.id);
    if (!branch) throw new customerUseCaseErrors.BranchNotFound();

    if (!branch.opened()) {
      throw new hostessUseCaseErrors.BranchIsNotOpen();
    }

    return this.branchStore.getCurrentTurns(branch.id, this.index);
  }

  _validate() {
    if (!this.branch) {
      throw new customerUseCaseErrors.BranchNotPresent();
    }

    if (!this.customer) {
      throw new customerUseCaseErrors.CustomerNotPresent();
    }

    if (!this.branchStore) {
      throw new customerUseCaseErrors.BranchStoreNotPresent();
    }
  }
}

module.exports = CustomerListTurns;

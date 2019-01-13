const errors = require('./errors');
const storeErrors = require('../../stores/errors');


// Hay N turnos en espera de ser atendidos. Deseas continuar?

class CustomerListTurns {
  constructor({
    index,
    customerId,
    branchId,
    branchStore,
    turnStore,
  }) {
    this.index = index;
    this.customerId = customerId;
    this.branchId = branchId;
    this.branchStore = branchStore;
    this.turnStore = turnStore;
    this.customerStore = customerStore;
  }

  execute() {
    const customer = this.customerStore.find(this.customerId);
    const branch = this.branchStore.find(this.branchId);

    return Promise.all([customer, branch])
      .then(([customer, branch]) => this._listTurns(branch))
      .catch(error => this._manageError(error));
  }

  _listTurns(branch) {
    if (!branch.isOpen()) {
      throw new errors.BranchIsNotOpen();
    }

    const shift = branch.getShift();
    if (!shift) {
      throw new errors.UnavailableBranchShift();
    }

    return this.turnStore.findByBranch(branch.id, shift.start, this.index);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new errors.BranchNotCreated();
    } else if(error instanceof storeErrors.CustomerNotFound) {
      throw new errors.CustomerNotFound();
    } else if(error instanceof storeErrors.CustomerNotCreated) {
      throw new errors.CustomerNotCreated();
    }

    // console.log(error)
    throw error;
  }
}

module.exports = CustomerListTurns;

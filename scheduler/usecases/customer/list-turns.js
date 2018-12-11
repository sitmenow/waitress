const customerUseCaseErrors = require('./errors');
const storeErrors = require('../../stores/errors');


// Hay N turnos en espera de ser atendidos. Deseas continuar?

class CustomerListTurns {
  constructor(customer, branch, index, branchStore, turnStore) {
    this.index = index;
    this.branch = branch;
    this.customer = customer;
    this.branchStore = branchStore;
    this.turnStore = turnStore;

    this._validate();
  }

  execute() {
    return this.branchStore.find(this.branch.id)
      .then(branch => this._getBranchCurrentShiftTurns(branch))
      .catch(error => this._manageError(error));
  }

  _getBranchCurrentShiftTurns(branch) {
    const shift = branch.getShift();

    if (!shift) {
      // throw new customerUseCaseErrors.BranchIsNotOpen();
      return [];
    }

    return this.turnStore.findByBranch(branch.id, shift.start, this.index);
  }

  _manageError(error) {
    if (error instanceof storeErrors.BranchNotFound) {
      throw new customerUseCaseErrors.BranchNotFound();
    } else if (error instanceof storeErrors.BranchNotCreated) {
      throw new customerUseCaseErrors.BranchNotCreated();
    }

    // else if(error instanceof customerUseCaseErrors.BranchIsNotOpen) {
    //  return [];
    // }

    console.log(error)
    throw error;
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

    if (!this.turnStore) {
      throw new customerUseCaseErrors.TurnStoreNotPresent();
    }
  }
}

module.exports = CustomerListTurns;

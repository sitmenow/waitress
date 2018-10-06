const customerErrors = require('./errors');


class ListTurns {
  constructor(branchID, branchStore) {
    this.branchID = branchID;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    let currentTurns;

    try {
      currentTurns = this.branchStore.currentTurns(this.branchID);
    } catch(error) {
      throw new customerErrors.BranchNotFound();
    }

    return currentTurns;
  }

  _validate() {
    if (!this.branchID) {
      throw new customerErrors.BranchIDNotPresent();
    }

    if (!this.branchStore) {
      throw new customerErrors.BranchStoreNotPresent();
    }
  }
}

module.exports = ListTurns;

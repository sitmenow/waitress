const customerErrors = require('./errors');


class CreateTurn {
  constructor(branchID, branchStore) {
    this.branchID = branchID;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    let turn;

    try {
      turn = this.branchStore.createTurn(this.branchID);
    } catch(error) {
      throw new customerErrors.BranchNotFound();
    }

    return turn;
  }

  _validate() {
    if (!this.branchStore) {
      throw new customerErrors.BranchStoreNotPresent();
    }

    if (!this.branchID) {
      throw new customerErrors.BranchIDNotPresent();
    }
  }
}

module.exports = CreateTurn;

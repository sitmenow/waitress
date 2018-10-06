const customerErrors = require('./errors');
const storeErrors = require('../../store/errors');


class ListTurns {
  constructor(branchID, turnStore) {
    this.branchID = branchID;
    this.turnStore = turnStore;

    this._validate();
  }

  execute() {
    let currentTurns;

    try {
      currentTurns = this.turnStore.getCurrents(this.branchID);
    } catch(error) {
      if (error instanceof storeErrors.BranchNotFound) {
        throw new customerErrors.UnableToListTurns();
      }

      throw new customerErrors.CustomerError();
    }

    return currentTurns;
  }

  _validate() {
    if (!this.branchID) {
      throw new customerErrors.BranchIDNotPresent();
    }

    if (!this.turnStore) {
      throw new customerErrors.TurnStoreNotPresent();
    }
  }
}

module.exports = ListTurns;

const customerErrors = require('./errors');
const storeErrors = require('../../store/errors');


class CreateTurn {
  constructor(customerID, branchID, turnStore) {
    this.customerID = customerID;
    this.branchID = branchID;
    this.turnStore = turnStore;

    this._validate();
  }

  execute() {
    let turn;

    try {
      turn = this.turnStore.create(this.customerID, this.branchID);
    } catch(error) {
      if (error instanceof storeErrors.CustomerNotFound) {
        throw new customerErrors.UnableToCreateTurn();
      }

      if (error instanceof storeErrors.BranchNotFound) {
        throw new customerErrors.UnableToCreateTurn();
      }

      throw new customerErrors.CustomerError();
    }

    return turn;
  }

  _validate() {
    if (!this.turnStore) {
      throw new customerErrors.TurnStoreNotPresent();
    }

    if (!this.branchID) {
      throw new customerErrors.BranchIDNotPresent();
    }

    if (!this.customerID) {
      throw new customerErrors.CustomerIDNotPresent();
    }
  }
}

module.exports = CreateTurn;

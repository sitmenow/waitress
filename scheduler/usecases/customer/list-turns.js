const customerErrors = require('./errors');


class ListTurns {
  constructor(branchStore) {
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    let currentTurns;

    try {
      currentTurns = this.branchStore.currentTurns();
    } catch(error) {
      throw new customerErrors.TurnsNotFound();
    }

    return currentTurns;
  }

  _validate() {
    if (!this.branchStore) {
      throw new Error('Restaurant Branch Store cannot be null');
    }
  }
}

module.exports = ListTurns;

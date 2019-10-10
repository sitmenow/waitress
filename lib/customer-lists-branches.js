const { CorruptedBranch } = require('./errors');
const { BranchEntityNotCreated } = require('./database/errors');


class CustomerListsBranches {
  constructor({ userId, radius, database } = {}) {
    this.userId = userId;
    this.radius = radius;
    this.database = database;
  }

  execute() {
    return this.database.branches.all()
      .catch(error => this._manageError(error));
  }

  _manageError(error) {
    if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    }

    throw error;
  }
}

module.exports = CustomerListsBranches;

const databaseErrors = require('../../database/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');

class HostessServeCoffeeTurn {
  constructor({ turnId, branchId, hostessId, database }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const hostess = this.database.hostesses.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._serveCoffeeTurns(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  async _serveCoffeeTurns(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    if (branch.isClosed()) {
      // This should be at use case error level
      throw new schedulerErrors.BranchIsClosed();
    }

    turn.serve();
    // In reservations: Cancel all other active turns
    // for this customer

    return this.database.turns.update(turn)
      .then(_ => this.database.turnsCache.remove(turn.id))
      .then(_ => turn);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof databaseErrors.TurnEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof databaseErrors.HostessModelNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof databaseErrors.HostessEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof databaseErrors.BranchEntityNotCreated) {
      throw new errors.TurnNotUpdated();
    } else if (error instanceof databaseErrors.TurnModelNotUpdated) {
      throw new errors.TurnNotUpdated();
    }

    // else if (error instanceof schedulerErrors.BranchIsClosed) {
    //   throw new errors.TurnNotUpdated();
    // } else if (error instanceof schedulerErrors.TurnNotAllowedToChangeStatus) {
    //   throw new errors.TurnNotUpdated();
    // }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessServeCoffeeTurn;

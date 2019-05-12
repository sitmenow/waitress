const databaseErrors = require('../../database/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');

class HostessRejectGasTurn {
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
      .then(([turn, hostess, branch]) => this._rejectGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _rejectGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    turn.reject();

    return Promise.all([
      this.database.turns.update(turn),
      this.database.cache.removeGasTurn(turn.id)
    ]);
  }

  _manageError(error) {
    if (error instanceof databaseErrors.TurnModelNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof databaseErrors.HostessModelNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof databaseErrors.BranchModelNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof databaseErrors.TurnModelNotUpdated) {
      throw new errors.TurnNotRejected();
    } else if (error instanceof schedulerErrors.TurnNotAllowedToChangeStatus) {
      throw new errors.TurnNotRejected();
    }

    throw error;
  }
}

module.exports = HostessRejectGasTurn;

const databaseErrors = require('../../database/errors');
const schedulerErrors = require('../../errors');
const errors = require('./errors');


class HostessAwaitGasTurn {
  constructor({ turnId, branchId, hostessId, database }) {
    this.turnId = turnId;
    this.branchId = branchId;
    this.hostessId = hostessId;
    this.database = database;
  }

  execute() {
    const turn = this.database.turns.find(this.turnId);
    const hostess = this.database.hostess.find(this.hostessId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([turn, hostess, branch])
      .then(([turn, hostess, branch]) => this._awaitGasTurn(turn, hostess, branch))
      .catch(error => this._manageError(error));
  }

  _awaitGasTurn(turn, hostess, branch) {
    if (branch.id != hostess.branch.id) {
      throw new errors.HostessDoesNotBelongToBranch();
    }

    if (branch.id != turn.branch.id) {
      throw new errors.TurnDoesNotBelongToBranch();
    }

    const expectedArrivalTime = new Date();
    return this.database.cache.updateGasTurn(turn.id, expectedArrivalTime)
      .then(() => {
        turn.expectedArrivalTime = expectedArrivalTime;
        return turn;
      });
  }

  _manageError(error) {
    if (error instanceof databaseErrors.TurnNotFound) {
      throw new errors.TurnNotFound();
    } else if (error instanceof databaseErrors.HostessNotFound) {
      throw new errors.HostessNotFound();
    } else if (error instanceof databaseErrors.BranchNotFound) {
      throw new errors.BranchNotFound();
    } else if (error instanceof databaseErrors.TurnNotUpdated) {
      throw new errors.TurnNotServed();
    } else if (error instanceof schedulerErrors.TurnMustBeWaitingToBeServed) {
      throw new errors.UnableToServeTurn();
    }

    // console.log(error);
    throw error;
  }
}

module.exports = HostessAwaitGasTurn;

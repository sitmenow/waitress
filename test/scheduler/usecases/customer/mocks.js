const Branch = require('../../../../scheduler/models/branch');
const Turn = require('../../../../scheduler/models/turn');


class BranchStoreMock {
  constructor({ currentTurns, createdTurn } = {}) {
    this.currentTurnsResponse = currentTurns;
    this.createTurnResponse = createdTurn;
  }

  currentTurns(branchID) {
    return this.currentTurnsResponse;
  }

  createTurn(branchID) {
    return this.createTurnResponse;
  }
}

module.exports = {
  BranchStoreMock,
}


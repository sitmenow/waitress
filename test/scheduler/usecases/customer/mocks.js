const Branch = require('../../../../scheduler/models/branch');
const Turn = require('../../../../scheduler/models/turn');


class BranchStoreMock {
  constructor(currentTurns) {
    this.currentTurnsResponse = currentTurns;
  }

  currentTurns() {
    return this.currentTurnsResponse;
  }
}

module.exports = {
  BranchStoreMock,
}


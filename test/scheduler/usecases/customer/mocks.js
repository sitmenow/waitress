const Branch = require('../../../../scheduler/models/branch');
const Turn = require('../../../../scheduler/models/turn');


class BranchStoreMock {
  constructor() {
  }
}

class TurnStoreMock {
  constructor() {
    this.userID = null;
    this.branchID = null;
  }

  create(userID, branchID) {
    this.userID = userID;
    this.branchID = branchID;
  }

  getCurrents(branchID) {
    this.branchID = branchID;
  }
}

module.exports = {
  BranchStoreMock,
  TurnStoreMock,
}


const Branch = require('../../../scheduler/branch');
const Turn = require('../../../scheduler/turn');


class BranchStoreMock {
  constructor() {
  }
}

class TurnStoreMock {
  constructor() {
    this.userID = null;
    this.branchID = null;
    this.turnID = null;
  }

  create(userID, branchID) {
    this.userID = userID;
    this.branchID = branchID;
  }

  getCurrents(branchID) {
    this.branchID = branchID;
  }

  remove(turnID) {
    this.turnID = turnID;
  }
}

class HostessStoreMock {
  constructor() {
  }

  findById() {
  }

  find() {}
}

class CustomerStoreMock {
  constructor() {}

  getDefaultCustomer() {}
}


module.exports = {
  BranchStoreMock,
  TurnStoreMock,
  HostessStoreMock,
  CustomerStoreMock,
}


class TurnCacheStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(turn) {
    return this.gateway.create(turn);
  }

  remove(turnId) {
    return this.gateway.remove(turnId);
  }

  findByBranch(branchId) {
    return this.gateway.findByBranch(branchId);
  }

  findByCustomer(customerId) {
    return this.gateway.findByCustomer(customerId);
  }
}


module.exports = TurnCacheStore;

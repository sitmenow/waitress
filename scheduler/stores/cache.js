class CacheStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  getBranchGasTurns(branchId) {
    return this.gateway.getBranchGasTurns(branchId);
  }
}

module.exports = CacheStore;

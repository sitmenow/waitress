class CacheStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  getBranchGasTurns(branchId) {
    this.gateway.getBranchGasTurns(branchId);
  }
}

module.exports = CacheStore;

class CacheStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  getBranchGasTurns(branchId, limit) {
    return this.gateway.getBranchGasTurns(branchId, limit);
  }

  createGasTurn(turnId, branchId) {
    return this.gateway.createGasTurn(turnId, branchId);
  }

  removeGasTurn(turnId) {
    return this.gateway.removeGasTurn(turnId);
  }

  updateGasTurn(turnId, expectedArrivalTime) {
    return this.gateway.updateGasTurn(turnId, expectedArrivalTime);
  }
}


module.exports = CacheStore;

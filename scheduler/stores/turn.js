class TurnStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  all() {
    return this.gateway.all();
  }

  create(turn) {
    return this.gateway.create(turn);
  }

  find(turnId) {
   return this.gateway.find(turnId);
  }

  remove(turnId) {
    return this.gateway.remove(turnId);
  }

  update(turn) {
    return this.gateway.update(turn);
  }

  findByBranch(branchId, start) {
    return this.gateway.findByBranch(branchId, start);
  }

  findByBranchAndStatus(branchId, status) {
    return this.gateway.findByBranchAndStatus(branchId, status);
  }

  findWaitingByBranchAndRequestedTimeRange(branchId, start, end, status) {
    return this.gateway.findWaitingByBranchAndRequestedTimeRange(
      branchId, start, end
    );
  }
}

module.exports = TurnStore;

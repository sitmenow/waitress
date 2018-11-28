class TurnStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(turn) {
    return this.gateway.create(turn);
  }

  find(turn_id) {
   return this.gateway.find(turn_id);
  }

  remove(turn_id) {
    return this.gateway.remove(turn_id);
  }

  update(turn) {
    return this.gateway.update(turn);
  }

  findByBranch(branchId, start, index) {
    return this.gateway.findByBranch(branchId, start, index);
  }
}

module.exports = TurnStore;

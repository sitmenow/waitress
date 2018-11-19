class BranchStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(branch) {
    this.gateway.create(branch);
  }

  find(branchId) {
    this.gateway.find(branchId);
  }

  update(branch) {
    this.gateway.update(branch);
  }
}

module.exports = BranchStore;

class BranchStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  all() {
    return this.gateway.all();
  }

  create(branch) {
    return this.gateway.create(branch);
  }

  find(branchId) {
    return this.gateway.find(branchId);
  }

  update(branch) {
    return this.gateway.update(branch);
  }
}

module.exports = BranchStore;

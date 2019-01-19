class HostessStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  all() {
    return this.gateway.all();
  }

  create(hostess) {
    return this.gateway.create(hostess);
  }

  find(hostessId) {
    return this.gateway.find(hostessId);
  }

  update(hostess) {
    return this.gateway.update(hostess);
  }
}

module.exports = HostessStore;

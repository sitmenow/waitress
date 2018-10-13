class HostessStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(turn) {
    this.gateway.create(turn);
  }

  find(turnId) {
    this.gateway.find(turnId);
  }

  update(turn) {
    this.gateway.update(turn);
  }
}

module.exports = HostessStore;

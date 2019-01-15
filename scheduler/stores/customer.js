class CustomerStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(turn) {
    return this.gateway.create(turn);
  }

  find(turnId) {
    return this.gateway.find(turnId);
  }

  update(turn) {
    return this.gateway.update(turn);
  }

  getDefaultCustomer() {
    return this.gateway.getDefaultCustomer();
  }
}

module.exports = CustomerStore;

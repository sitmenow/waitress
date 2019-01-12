class CustomerStore {
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

  getDefaultCustomer() {
    this.gateway.getDefaultCustomer();
  }
}

module.exports = CustomerStore;

class CustomerStore {
  constructor(gateway) {
    this.gateway = gateway;
  }

  create(customer) {
    return this.gateway.create(customer);
  }

  find(customerId) {
    return this.gateway.find(customerId);
  }

  findByName(customerName) {
    return this.gateway.findByName(customerName);
  }

  update(customer) {
    return this.gateway.update(customer);
  }

  getDefaultCustomer() {
    return this.gateway.getDefaultCustomer();
  }
}

module.exports = CustomerStore;

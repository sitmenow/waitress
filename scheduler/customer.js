class Customer {
  constructor({ id, name }) {
    this._id = id;
    this.name = name;
  }

  get id() {
    return this._id;
  }
}

module.exports = Customer;

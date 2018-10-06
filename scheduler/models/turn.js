
class Turn {
  constructor({ id, datetime, active, customer, branch }) {
    this.id = id;
    this.datetime = datetime;
    this.active = active;
    this.customer = customer;
    this.branch = branch;
    this.notes = [];
  }
}

module.exports = Turn;

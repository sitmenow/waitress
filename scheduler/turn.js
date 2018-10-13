
class Turn {
  constructor({ id, name, date, active, customer, branch }) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.active = active;
    this.customer = customer;
    this.branch = branch;
    this.notes = [];
  }
}

module.exports = Turn;


class Turn {
  constructor(id, datetime, active, user) {
    this.id = id;
    this.datetime = datetime;
    this.active = active;
    this.user = user;
    this.branch = branch;
    this.notes = [];
  }
}

module.exports = Turn;

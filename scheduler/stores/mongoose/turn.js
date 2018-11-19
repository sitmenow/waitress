// TypeORM Turn Store

const Turn = require('scheduler/store/typeorm/turn');


class TurnStore {
  constructor(connection) {
    this.connection = connection;
  }

  create(turn) {
    // Expects branch
    // Expects date
    // Expects name
  }

  find(turn_id) {
  }

  remove(turn_id) {
  }

  update(turn) {
  }

  detail(turn_id) {
  }
}

module.exports = TurnStore;

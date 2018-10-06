const listTurns = require('./list-turns');
const enqueueTurn = require('./enqueue-turn');
const rejectTurn = require('./reject-turn');
const detailTurn = require('./detail-turn');
const serveTurn = require('./serve-turn');


module.exports = (stores, services) => {
  listTurns: listTurns(stores, services),
  enqueueTurn: enqueueTurn(stores, services),
  rejectTurn: rejectTurn(stores, services),
  serveTurn: serveTurn(stores, services),
  deatilTurn: detailTurn(stores, services),
};

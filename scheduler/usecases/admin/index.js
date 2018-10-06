const listTurns = require('./list-turns');
const createTurn = require('./create-turn');
const removeTurn = require('./remove-turn');
const detailTurn = require('./detail-turn');
const updateTurn = require('./update-turn');


module.exports = (stores, services) => {
  listTurns: listTurns(stores, services),
  createTurn: createTurn(stores, services),
  removeTurn: removeTurn(stores, services),
  updateTurn: updateTurn(stores, services),
  deatilTurn: detailTurn(stores, services),
};

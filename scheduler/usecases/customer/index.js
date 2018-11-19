const ListTurns = require('./list-turns');
const CreateTurn = require('./create-turn');
const RemoveTurn = require('./remove-turn');
const DetailTurn = require('./detail-turn');
const UpdateTurn = require('./update-turn');


module.exports = (stores, services) => {
  listTurns: new ListTurns(stores, services),
  createTurn: new CreateTurn(stores, services),
  removeTurn: new RemoveTurn(stores, services),
  updateTurn: new UpdateTurn(stores, services),
  deatilTurn: new DetailTurn(stores, services),
};

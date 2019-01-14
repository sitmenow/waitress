// const adminUseCases = require('./admin');
const CustomerCreateTurn = require('./customer/create-turn');
const CustomerDetailTurn = require('./customer/detail-turn');

const HostessListGasTurns = require('./hostess/list-gas-turns');
const HostessServeGasTurn = require('./hostess/serve-gas-turn');
const HostessRejectGasTurn = require('./hostess/reject-gas-turn');

module.exports = {
  CustomerCreateTurn,
  CustomerDetailTurn,
  HostessListGasTurns,
  HostessServeGasTurn,
  HostessRejectGasTurn,
};

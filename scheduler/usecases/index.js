// const adminUseCases = require('./admin');
const CustomerCreateTurn = require('./customer/create-turn');
const CustomerDetailTurn = require('./customer/detail-turn');


const CustomerListGasTurns = require('./customer/list-gas-turns');
const CustomerCreateGasTurn = require('./customer/create-gas-turn');
const CustomerDetailGasTurn = require('./customer/detail-gas-turn');
const CustomerDetailGasStation = require('./customer/detail-gas-station');

const HostessListGasTurns = require('./hostess/list-gas-turns');
const HostessServeGasTurn = require('./hostess/serve-gas-turn');
const HostessRejectGasTurn = require('./hostess/reject-gas-turn');
const HostessToggleGasStation = require('./hostess/toggle-gas-station');

module.exports = {
  CustomerCreateTurn,
  CustomerDetailTurn,

  CustomerListGasTurns,
  CustomerDetailGasTurn,
  CustomerCreateGasTurn,
  CustomerDetailGasStation,

  HostessListGasTurns,
  HostessToggleGasStation,
  HostessServeGasTurn,
  HostessRejectGasTurn,
};

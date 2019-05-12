// const adminUseCases = require('./admin');
const AdminCreateSlackCoffeeCustomer = require('./admin/create-slack-coffee-customer');

const CustomerCreateGasTurn = require('./customer/create-gas-turn');
const CustomerListGasTurns = require('./customer/list-gas-turns');
const CustomerDetailGasTurn = require('./customer/detail-gas-turn');
const CustomerDetailGasStation = require('./customer/detail-gas-station');

const CustomerCreateCoffeeTurn = require('./customer/create-coffee-turn');
const CustomerCancelCoffeeTurn = require('./customer/cancel-coffee-turn');
const CustomerDetailCoffeeBranch = require('./customer/detail-coffee-branch');
const CustomerListOwnActiveCoffeeTurns = require('./customer/list-own-active-coffee-turns');

const HostessListGasTurns = require('./hostess/list-gas-turns');
const HostessServeGasTurn = require('./hostess/serve-gas-turn');
const HostessRejectGasTurn = require('./hostess/reject-gas-turn');
const HostessAwaitGasTurn = require('./hostess/await-gas-turn');
const HostessToggleGasStation = require('./hostess/toggle-gas-station');

const HostessListCoffeeTurns = require('./hostess/list-coffee-turns');
const HostessRejectCoffeeTurn = require('./hostess/reject-coffee-turn');
const HostessServeCoffeeTurn = require('./hostess/serve-coffee-turn');

module.exports = {
  AdminCreateSlackCoffeeCustomer,

  CustomerListGasTurns,
  CustomerDetailGasTurn,
  CustomerCreateGasTurn,
  CustomerDetailGasStation,

  CustomerCreateCoffeeTurn,
  CustomerCancelCoffeeTurn,
  CustomerDetailCoffeeBranch,
  CustomerListOwnActiveCoffeeTurns,

  HostessListGasTurns,
  HostessToggleGasStation,
  HostessServeGasTurn,
  HostessRejectGasTurn,
  HostessAwaitGasTurn,

  HostessListCoffeeTurns,
  HostessServeCoffeeTurn,
  HostessRejectCoffeeTurn,
};

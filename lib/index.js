// const adminUseCases = require('./admin');
const AdminCreatesSlackCoffeeCustomer = require('./admin-creates-slack-coffee-customer');

const CustomerCreatesGasTurn = require('./custome-screates-gas-turn');
const CustomerListsGasTurns = require('./customer-lists-gas-turns');
const CustomerDetailsGasTurn = require('./customer-details-gas-turn');
const CustomerDetailsGasStation = require('./customer/detail-gas-station');

const CustomerCreatesCoffeeTurn = require('./customer-creates-coffee-turn');
const CustomerCancelsCoffeeTurn = require('./customer-cancels-coffee-turn');
const CustomerDetailsCoffeeBranch = require('./customer-details-coffee-branch');
const CustomerListsOwnActiveCoffeeTurns = require('./customer-lists-own-active-coffee-turns');

const HostessListsGasTurns = require('./hostess-lists-gas-turns');
const HostessServesGasTurn = require('./hostess-serves-gas-turn');
const HostessRejectsGasTurn = require('./hostess-rejects-gas-turn');
const HostessAwaitsGasTurn = require('./hostess-awaits-gas-turn');
const HostessTogglesGasStation = require('./hostess-toggles-gas-station');

const HostessListsCoffeeTurns = require('./hostess-lists-coffee-turns');
const HostessRejectsCoffeeTurn = require('./hostess-rejects-coffee-turn');
const HostessServesCoffeeTurn = require('./hostess-serves-coffee-turn');

module.exports = {
  AdminCreatesSlackCoffeeCustomer,

  CustomerListsGasTurns,
  CustomerDetailsGasTurn,
  CustomerCreatesGasTurn,
  CustomerDetailsGasStation,

  CustomerCreatesCoffeeTurn,
  CustomerCancelsCoffeeTurn,
  CustomerDetailsCoffeeBranch,
  CustomerListsOwnActiveCoffeeTurns,

  HostessListsGasTurns,
  HostessTogglesGasStation,
  HostessServesGasTurn,
  HostessRejectsGasTurn,
  HostessAwaitsGasTurn,

  HostessListsCoffeeTurns,
  HostessServesCoffeeTurn,
  HostessRejectsCoffeeTurn,
};

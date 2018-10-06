const adminUseCases = require('./admin');
const customerUseCases = require('./customer');
const hostessUseCases = require('./hostess');

module.exports = (stores, services) => {
  admin: adminUseCases(stores, services),
  customer: customerUseCases(stores, services),
  hostess: hostessUseCases(stores, services),
};

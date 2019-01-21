const config = require('config');

const schedulerStores = require('./scheduler/stores');
const mongooseStore = require('./scheduler/stores/mongoose');
const mongooseBranchStore = require('./scheduler/stores/mongoose/branch');
const mongooseCustomerStore = require('./scheduler/stores/mongoose/customer');
const mongooseTurnStore = require('./scheduler/stores/mongoose/turn');
const mongooseHostessStore = require('./scheduler/stores/mongoose/hostess');
const mongooseCacheStore = require('./scheduler/stores/mongoose/cache');
// const dynamoDbStore = require('./scheduler/stores/dynamodb');
// const dynamoDbCacheStore = require('./scheduler/stores/dynamodb/cache');
const useCases = require('./scheduler/usecases');
const api = require('./api/gas');


const gateways = {
  branch: new mongooseBranchStore(),
  customer: new mongooseCustomerStore(),
  hostess: new mongooseHostessStore(),
  turn: new mongooseTurnStore(),
  cache: new mongooseCacheStore(),
};

const stores = {
  branchStore: new schedulerStores.BranchStore(gateways.branch),
  turnStore: new schedulerStores.TurnStore(gateways.turn),
  hostessStore: new schedulerStores.HostessStore(gateways.hostess),
  customerStore: new schedulerStores.CustomerStore(gateways.customer),
  cacheStore: new schedulerStores.CacheStore(gateways.cache),
};

const app = api(stores, useCases);

mongooseStore(config)
  .catch(error => console.log(`Error while connecting to Mongo: ${error}`));

app.disable('x-powered-by')
app.listen(config.api.port)


// Setup express app
// Setup sequelize
// Setup passport (for api tokens)
//
// Setup use cases and then pass them to the controllers

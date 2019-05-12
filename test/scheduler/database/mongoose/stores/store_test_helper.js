const config = require('config');

require('../../../test_helper')

const MongooseDatabase = require('../../../../../scheduler/database/mongoose');
const BrandModel = require('../../../../../db/mongoose/models/brand');
const BranchModel = require('../../../../../db/mongoose/models/branch');
const HostessModel = require('../../../../../db/mongoose/models/hostess');
const TurnModel = require('../../../../../db/mongoose/models/turn');
const TurnCacheModel = require('../../../../../db/mongoose/models/turn-cache');
const CustomerModel = require('../../../../../db/mongoose/models/customer');


before(() => {
  database = new MongooseDatabase(config.services.db);

  createBrandModel = brand => new BrandModel({
    id: brand.id,
    name: brand.name,
  });

  createBranchModel = branch => new BranchModel({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    location: {
      type: 'Point',
      coordinates: branch.coordinates,
    },
    lastOpeningTime: branch.lastOpeningTime,
    lastClosingTime: branch.lastClosingTime,
    brandId: branch.brandId,
  });

  createHostessModel = hostess => new HostessModel({
    id: hostess.id,
    name: hostess.name,
    branchId: hostess.branchId,
  });

  createCustomerModel = customer => new CustomerModel({
    id: customer.id,
    name: customer.name,
  });

  createTurnModel = turn => new TurnModel({
    id: turn.id,
    name: turn.name,
    status: turn.status,
    requestedTime: turn.requestedTime,
    expectedServiceTime: turn.expectedServiceTime,
    metadata: turn.metadata,
    branchId: turn.branchId,
    customerId: turn.customerId,
  });

  createTurnCacheModel = turn => new TurnCacheModel({
    _id: turn.id,
    name: turn.name,
    status: turn.status,
    requestedTime: turn.requestedTime,
    expectedServiceTime: turn.expectedServiceTime,
    metadata: turn.metadata,
    branchId: turn.branchId,
    customerId: turn.customerId,
  });

  return database
    .connect()
    .catch(error => console.log(`Error while connecting to database: ${error}`));
});

beforeEach(() => {
  // fixtures!!!
});

// NOTE: mocha opts file can work too!
// Close connection
after(() => {
  database
    .disconnect()
    .catch(error => console.log(`Error while disconnecting from database: ${error}`));
});

const config = require('config');

require('../../../test-helper')

const MongooseDatabase = require('../../../../../lib/database/mongoose');
const BrandModel = require('../../../../../db/mongoose/models/brand');
const BranchModel = require('../../../../../db/mongoose/models/branch');
const HostessModel = require('../../../../../db/mongoose/models/hostess');
const TurnModel = require('../../../../../db/mongoose/models/turn');
const TurnCacheModel = require('../../../../../db/mongoose/models/turn-cache');
const CustomerModel = require('../../../../../db/mongoose/models/customer');
const UserModel = require('../../../../../db/mongoose/models/user');


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
    brand: branch.brand,
  });

  createUserModel = user => new UserModel({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  });

  createHostessModel = hostess => new HostessModel({
    id: hostess.id,
    branchId: hostess.branchId,
    userId: hostess.userId,
  });

  createCustomerModel = customer => new CustomerModel({
    id: customer.id,
    userId: customer.userId,
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

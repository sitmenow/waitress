const config = require('config');

require('../../test_helper')

const database = require('../../../../scheduler/stores/mongoose');
const BrandModel = require('../../../../services/db/mongoose/models/brand');
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const HostessModel = require('../../../../services/db/mongoose/models/hostess');
const TurnModel = require('../../../../services/db/mongoose/models/turn');
const CustomerModel = require('../../../../services/db/mongoose/models/customer');
const BrandStore = require('../../../../scheduler/stores/mongoose/brand');
const HostessStore = require('../../../../scheduler/stores/mongoose/hostess');
const BranchStore = require('../../../../scheduler/stores/mongoose/branch');
const CustomerStore = require('../../../../scheduler/stores/mongoose/customer');
const TurnStore = require('../../../../scheduler/stores/mongoose/turn');


before(() => {
  mongoose = database(config)
    .catch(error => console.log(`Error while connecting to database: ${error}`));

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

  createHostessStore = () => new HostessStore();

  createBranchStore = () => new BranchStore();

  createCustomerStore = () => new CustomerStore();

  createTurnStore = () => new TurnStore();

  return mongoose;
});

beforeEach(() => {
  // fixtures!!!
});

// NOTE: mocha opts file can work too!
// Close connection
after(() => {
  mongoose
    .then(_ => _.connection.close())
    .catch(error => console.log(`Error while disconnecting from database: ${error}`));
});

const config = require('config');

const database = require('../../../../scheduler/stores/mongoose');
require('../../test_helper')
const RestaurantModel = require('../../../../services/db/mongoose/models/restaurant');
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const HostessModel = require('../../../../services/db/mongoose/models/hostess');
const TurnModel = require('../../../../services/db/mongoose/models/turn');
// const RestaurantStore = require('../../../../scheduler/stores/mongoose/restaurant');
const HostessStore = require('../../../../scheduler/stores/mongoose/hostess');
const BranchStore = require('../../../../scheduler/stores/mongoose/branch');
const CustomerStore = require('../../../../scheduler/stores/mongoose/customer');
const TurnStore = require('../../../../scheduler/stores/mongoose/turn');


before(() => {
  mongoose = database(config)
    .catch(error => console.log(`Error while connecting to database: ${error}`));

  createRestaurantModel = ({ restaurantId, restaurantName }) => {
    return new RestaurantModel({
      id: restaurantId,
      name: restaurantName,
    });
  };

  createBranchModel = ({
    branchId,
    branchName,
    branchAddress,
    lastOpeningTime,
    lastClosingTime,
    coordinates,
    restaurantId,
  }) => {
    return new BranchModel({
      id: branchId,
      name: branchName,
      address: branchAddress,
      location: {
        type: 'Point',
        coordinates,
      },
      lastOpeningTime,
      lastClosingTime,
      restaurantId,
    });
  };

  createHostessModel = ({ hostessName, hostessId, branchId }) => {
    return new HostessModel({
      id: hostessId,
      name: hostessName,
      branchId,
    });
  };

  createTurnModel = ({}) => {};

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

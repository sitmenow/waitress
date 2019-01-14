const config = require('config');

const database = require('../../../../scheduler/stores/mongoose');
require('../../test_helper')
const BranchModel = require('../../../../services/db/mongoose/models/branch');
const HostessModel = require('../../../../services/db/mongoose/models/hostess');
const HostessStore = require('../../../../scheduler/stores/mongoose/hostess');


before(() => {
  mongoose = database(config)
    .catch(error => console.log(`Error while connecting to database: ${error}`));

  createBranchModel = ({ branchName, restaurantId }) => {
    return new BranchModel({
      id: restaurantId,
      name: branchName,
    });
  };

  createHostessModel = ({ hostessName, branchId }) => {
    return new HostessModel({
      id: branchId,
      name: hostessName,
    });
  };

  createHostessStore = () => new HostessStore();

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

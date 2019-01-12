const database = require('../../../../database');

require('../../test_helper')

before(() => {
  mongoose = database()
    .catch(error => console.log(`Error while connecting to database: ${error}`));
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

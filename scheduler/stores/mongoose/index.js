const mongoose = require('mongoose');


function URI({ scheme, host, database }) {
  return scheme + '://' + host + '/' + database;
  // return 'mongodb://localhost/test';
}

// TODO: Look for In-Memory engine
// Always use mongoose.connect instead of mongoose.createConnection
module.exports = (config) => {
  const uri = URI(config.services.db);

  return mongoose.connect(uri, config.services.db.options);
};

const config = require('config');
const mongoose = require('mongoose');


function URI({ scheme, host, database }) {
  return scheme + '://' + host + '/' + database;
  // return 'mongodb://localhost/test';
}

const uri = URI(config.services.db);

// TODO: Look for In-Memory engine
// Always use mongoose.connect instead of mongoose.createConnection
module.exports = () => mongoose.connect(uri, config.services.db.options);

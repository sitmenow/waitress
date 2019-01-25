const mongoose = require('mongoose');


function URI({ scheme, host, port, user, password, database }) {
  let uri = scheme + '://';

  if (user && password) {
    uri += `${user}:${password}@`;
  }

  uri += host;
  if (port) {
    uri += `:${port}`;
  }

  uri += `/${database}`;

  return uri;
  // return 'mongodb://username:password@host:port/database?options...'
}

// TODO: Look for In-Memory engine
// Always use mongoose.connect instead of mongoose.createConnection
module.exports = (config) => {
  const uri = URI(config.services.db);

  return mongoose.connect(uri, config.services.db.options);
};

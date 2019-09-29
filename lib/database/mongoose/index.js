const mongoose = require('mongoose');

const BrandStore = require('./stores/brand');
const BranchStore = require('./stores/branch');
const HostessStore = require('./stores/hostess');
const CustomerStore = require('./stores/customer');
const TurnStore = require('./stores/turn');
const TurnCacheStore = require('./stores/turn-cache');
const CacheStore = require('./stores/cache');
const UserStore = require('./stores/user');

class MongooseDatabase {
  constructor({
    scheme, host, port, user, password, database, options,
  }) {
    this.scheme = scheme;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.name = database;
    this.connection = null;

    this.connect(options);

    this.brands = new BrandStore();
    this.branches = new BranchStore();
    this.hostesses = new HostessStore();
    this.customers = new CustomerStore();
    this.turns = new TurnStore();
    this.turnsCache = new TurnCacheStore();
    this.cache = new CacheStore();
    this.users = new UserStore();
  }

  buildURI() {
    let uri = `${this.scheme}://`;

    if (this.user && this.password) {
      uri += `${this.user}:${this.password}@`;
    }

    uri += this.host;

    if (this.port) {
      uri += `:${this.port}`;
    }

    uri += `/${this.name}`;

    return uri;
  }

  connect(options) {
    if (!this.connection) {
      this.connection = mongoose
        .connect(this.buildURI(), options)
        .catch(error =>
          console.log(`Error while connecting to Mongo: ${error}`)
        );
    }

    return this.connection;
  }

  disconnect() {
    if (this.connection) {
      return this.connection
        .then(_ => _.connection.close());
    }
  }
}

module.exports = MongooseDatabase;

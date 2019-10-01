const BrandStore = require('./stores/brand');
const BranchStore = require('./stores/branch');
const HostessStore = require('./stores/hostess');
const CustomerStore = require('./stores/customer');
const TurnStore = require('./stores/turn');
const TurnCacheStore = require('./stores/turn-cache');
const CacheStore = require('./stores/cache');
const UserStore = require('./stores/user');
const AdminStore = require('./stores/admin');

class InMemoryDatabase {
  constructor() {
    this.brands = new BrandStore();
    this.branches = new BranchStore();
    this.hostesses = new HostessStore();
    this.customers = new CustomerStore();
    this.turns = new TurnStore();
    this.turnsCache = new TurnCacheStore();
    this.cache = new CacheStore();
    this.users = new UserStore();
    this.admin = new AdminStore();
  }
}

module.exports = InMemoryDatabase;

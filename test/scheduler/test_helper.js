const Turn = require('../../scheduler/turn');
const Branch = require('../../scheduler/branch');
const Brand = require('../../scheduler/brand');
const Schedule = require('../../scheduler/schedule');
const Hostess = require('../../scheduler/hostess');
const Customer = require('../../scheduler/customer');

const TurnStore = require('../../scheduler/stores/turn')
const BranchStore = require('../../scheduler/stores/branch')
const CustomerStore = require('../../scheduler/stores/customer')
const HostessStore = require('../../scheduler/stores/hostess')
const CacheStore = require('../../scheduler/stores/cache');


before(() => {
  createBranch = branch => new Branch({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    coordinates: branch.coordinates,
    lastOpeningTime: branch.lastOpeningTime,
    lastClosingTime: branch.lastClosingTime,
    brand: branch.brand,
  });

  createCustomer = customer => new Customer({
    id: customer.id,
    name: customer.name,
  });

  createTurn = turn => new Turn({
    id: turn.id,
    name: turn.name,
    status: turn.status,
    requestedTime: turn.requestedTime,
    expectedServiceTime: turn.expectedServiceTime,
    metadata: turn.metadata,
    branch: turn.branch,
    customer: turn.customer,
  });

  createHostess = hostess => new Hostess({
    id: hostess.id,
    name: hostess.name,
    branch: hostess.branch,
  });

  createBrand = brand => new Brand({
    id: brand.id,
    name: brand.name,
  });

  createTurnStore = () => new TurnStore();

  createHostessStore = () => new HostessStore();

  createBranchStore = () => new BranchStore();

  createCustomerStore = () => new CustomerStore();

  createCacheStore = () => new CacheStore();
});

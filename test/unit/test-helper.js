const Turn = require('../../lib/turn');
const Branch = require('../../lib/branch');
const Brand = require('../../lib/brand');
const Schedule = require('../../lib/schedule');
const Hostess = require('../../lib/hostess');
const Customer = require('../../lib/customer');
const Admin = require('../../lib/admin');
const User = require('../../lib/user');

const InMemoryDatabase = require('../../lib/database/in-memory')

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

  createUser = user => new User({
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  });

  createAdmin = admin => new Admin({
    id: admin.id,
    user: admin.user,
  });

  createCustomer = customer => new Customer({
    id: customer.id,
    user: customer.user,
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
    branch: hostess.branch,
    user: hostess.user,
  });

  createBrand = brand => new Brand({
    id: brand.id,
    name: brand.name,
  });

  database = new InMemoryDatabase();
});

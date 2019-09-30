const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  CustomerModelNotFound,
  CustomerModelNotCreated } = require('../../../../../../lib/database/errors');
const CustomerModel = require('../../../../../../db/mongoose/models/customer');
const UserModel = require('../../../../../../db/mongoose/models/user');

suite('Mongoose CustomerStore #create', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    userModel = createUserModel({
      _id: 'user-id',
      name: 'User Test',
      email: 'user@example.com',
      picture: 'https://example.com/user/picture',
    });

    return userModel.save();
  });

  suiteTeardown(() => {
    return userModel.delete();
  });

  setup(() => {
    user = createUser({
      id: userModel.id,
    });
    customer = createCustomer({
      user,
    });
  });

  teardown(() => {
    sandbox.restore();

    return CustomerModel.deleteMany({});
  });

  test('creates a customer model with the given customer entity', async () => {
    const customerId = await database.customers.create(customer);

    const storedCustomer = await CustomerModel.findById(customerId);

    expect(customer.user.id).equal(storedCustomer.userId);
  });

  test('returns the id of the created customer model', async () => {
    const customerId = await database.customers.create(customer);

    expect(customerId).to.be.not.null;
  });

  test('returns a valid mongoose object id', async () => {
    const customerId = await database.customers.create(customer);

    expect(mongoose.Types.ObjectId.isValid(customerId)).to.be.true;
  });

  test('throws a customer model not created error ' +
       'when an error occurs while casting the customer entity', (done) => {
    sandbox.stub(database.customers, '_objectToModel')
      .throws(new CustomerModelNotCreated());

    database.customers.create(customer)
      .catch((error) => {
        expect(error).to.be.instanceof(CustomerModelNotCreated);
        done();
      });
  });
});

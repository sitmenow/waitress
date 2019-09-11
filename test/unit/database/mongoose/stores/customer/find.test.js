const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  CustomerModelNotFound,
  CustomerEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose CustomerStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  suiteTeardown(() => {});

  setup(() => {
    customerModel = createCustomerModel({
      name: 'Customer Test',
    });

    return customerModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return customerModel.delete();
  });

  test('finds the customer for the requested id', async () => {
    const expectedCustomer = createCustomer({
      id: customerModel.id,
      name: customerModel.name,
    });

    const customer = await database.customers.find(customerModel.id);

    assert.deepEqual(expectedCustomer, customer);
  });

  test('throws a customer model not found error ' +
       'when the given customer id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    database.customers.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(CustomerModelNotFound);
        done();
      });
  });

  test('throws a customer entity not created error ' +
       'when an error occurs while casting the customer model', (done) => {
    sandbox.stub(database.customers, '_modelToObject')
      .throws(new CustomerEntityNotCreated());

    database.customers.find(customerModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(CustomerEntityNotCreated);
        done();
      });
  });
});

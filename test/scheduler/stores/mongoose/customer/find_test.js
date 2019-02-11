const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('../store_test_helper');

const errors = require('../../../../../scheduler/stores/errors');


suite('Mongoose CustomerStore #find()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  suiteTeardown(() => {
  });

  setup(() => {
    customerStore = createCustomerStore();

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

    const customer = await customerStore.find(customerModel.id);

    assert.deepEqual(expectedCustomer, customer);
  });

  test('throws a customer model not found error ' +
       'when the given id does not exist', (done) => {
    const nonExistentId = mongoose.Types.ObjectId();

    customerStore.find(nonExistentId)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.CustomerModelNotFound);
        done();
      });
  });

  test('throws a customer entity not created error', (done) => {
    sandbox.stub(customerStore, '_modelToObject')
      .throws(new errors.CustomerEntityNotCreated());

    customerStore.find(customerModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(errors.CustomerEntityNotCreated);
        done();
      });
  });
});

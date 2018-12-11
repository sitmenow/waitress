const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Customer = require('../../../../scheduler/customer');
const CustomerStore = require('../../../../scheduler/stores/mongoose/customer');
const CustomerModel = require('../../../../services/db/mongoose/models/customer');
const customerStoreErrors = require('../../../../scheduler/stores/errors');


suite('Mongoose CustomerStore', () => {

  setup(() => {
    customerStore = new CustomerStore();
  });

  suite('#find()', () => {

    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      customerModel = new CustomerModel({
        name: 'test',
      });
      return customerModel.save();
    });

    suiteTeardown(() => {
      sandbox.restore();
      return customerModel.delete();
    });

    test('returns a customer with the given id', async () => {
      const expectedCustomer = new Customer({
        id: customerModel.id,
        name: customerModel.name,
      });
      const customer = await customerStore.find(customerModel.id);

      assert.deepEqual(expectedCustomer, customer);
    });

    test('throws a customer not found error', (done) => {
      const nonExistentId = mongoose.Types.ObjectId();

      customerStore.find(nonExistentId)
        .catch((error) => {
          expect(error).to.be.instanceof(customerStoreErrors.CustomerNotFound);
          done();
        });
    });

    test('throws a customer not created error', (done) => {
      sandbox.stub(customerStore, '_modelToObject')
        .throws(new customerStoreErrors.CustomerNotCreated());

      customerStore.find(customerModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(customerStoreErrors.CustomerNotCreated);
          done();
        });
    });
  });
});

const { assert, expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

require('./store_test_helper');

const Customer = require('../../../../scheduler/customer');
const CustomerStore = require('../../../../scheduler/stores/mongoose/customer');
const CustomerModel = require('../../../../services/db/mongoose/models/customer');
const storeErrors = require('../../../../scheduler/stores/errors');


suite('Mongoose CustomerStore', () => {
  suiteSetup(() => {
    customerStore = new CustomerStore();
  });

  suite('#getDefaultCustomer()', () => {
    suiteSetup(() => {
      sandbox = sinon.createSandbox();
      customerModel = new CustomerModel({
        name: 'DEFAULT_CUSTOMER',
      });

      return customerModel.save();
    });

    suiteTeardown(() => {
      return customerModel.delete();
    });

    teardown(() => {
      sandbox.restore();
    });

    test('returns the default customer', async () => {
      const expectedCustomer = new Customer({
        id: customerModel.id,
        name: customerModel.name,
      });

      const customer = await customerStore.getDefaultCustomer();

      assert.deepEqual(expectedCustomer, customer);
    });

    test('throws a customer not found error', (done) => {
      sandbox.stub(CustomerModel, 'findOne')
        .returns(Promise.resolve(null));

      customerStore.getDefaultCustomer()
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.CustomerNotFound);
          done();
        });
    });

    test('throws a customer object not created error', (done) => {
      sandbox.stub(customerStore, '_modelToObject')
        .throws(new storeErrors.CustomerNotCreated());

      customerStore.getDefaultCustomer()
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.CustomerNotCreated);
          done();
        });
    });
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
          expect(error).to.be.instanceof(storeErrors.CustomerNotFound);
          done();
        });
    });

    test('throws a customer not created error', (done) => {
      sandbox.stub(customerStore, '_modelToObject')
        .throws(new storeErrors.CustomerNotCreated());

      customerStore.find(customerModel.id)
        .catch((error) => {
          expect(error).to.be.instanceof(storeErrors.CustomerNotCreated);
          done();
        });
    });
  });
});

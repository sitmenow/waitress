const sinon = require('sinon');
const { expect, assert } = require('chai');

const { BranchStoreMock } = require('./mocks');
const customerErrors = require('../../../../scheduler/usecases/customer/errors');
const CreateTurn = require('../../../../scheduler/usecases/customer/create-turn');


suite('Customer Create Turn', () => {

  suiteSetup(() => {});

  test('created turn in restaurant branch', () => {
    const createdTurn = { id: 1 };

    const branchID = 1;
    const branchStore = new BranchStoreMock({ createdTurn });
    const useCase = new CreateTurn(branchID, branchStore);

    assert.deepEqual(createdTurn, useCase.execute());
  });

  test('BranchStore.createTurn is called once with the branch id as the only parameter', () => {
    const branchID = 1;
    const branchStore = new BranchStoreMock();
    const useCase = new CreateTurn(branchID, branchStore);
    sinon.spy(branchStore, 'createTurn');

    useCase.execute();
    assert.isTrue(branchStore.createTurn.withArgs(branchID).calledOnce);
  });

  test('BranchStore.createTurn throws a restaurant branch not found error', () => {
    const branchID = 1;
    const branchStore = new BranchStoreMock();
    const useCase = new CreateTurn(branchID, branchStore);
    branchStore.createTurn = () => { throw new customerErrors.BranchNotFound() };

    assert.throws(
      useCase.execute,
      customerErrors.BranchNotFound
    );
  });

  test('invalid branch store while creating use case', () => {
    const branchID = 1;
    const branchStore = null;

    assert.throws(
      () => { new CreateTurn(branchID, branchStore) },
      customerErrors.BranchStoreNotPresent
    );
  });

  test('invalid branch id while creating use case', () => {
    const branchID = null;
    const branchStore = new BranchStoreMock();

    assert.throws(
      () => { new CreateTurn(branchID, branchStore) },
      customerErrors.BranchIDNotPresent
    );
  });
});

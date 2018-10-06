const sinon = require('sinon');
const { expect, assert } = require('chai');

const { BranchStoreMock } = require('./mocks');
const customerErrors = require('../../../../scheduler/usecases/customer/errors');
const ListTurns = require('../../../../scheduler/usecases/customer/list-turns');


suite('Customer List Turns', () => {

  suiteSetup(() => {});

  test('current turns in a restaurant branch', () => {
    const currentTurns = [
      { id: 1 },
      { id: 2 },
    ];

    const branchID = 1;
    const branchStore = new BranchStoreMock({ currentTurns });
    const useCase = new ListTurns(branchID, branchStore);

    assert.deepEqual(currentTurns, useCase.execute());
  });

  test('BranchStore.currentTurns is called once with the branch id as the only parameter', () => {
    const branchID = 1;
    const branchStore = new BranchStoreMock();
    const useCase = new ListTurns(branchID, branchStore);
    sinon.spy(branchStore, 'currentTurns');

    useCase.execute();
    assert.isTrue(branchStore.currentTurns.withArgs(branchID).calledOnce);
  });

  test('BranchStore.currentTurns throws a restaurant branch not found error', () => {
    const branchID = 1;
    const branchStore = new BranchStoreMock();
    const useCase = new ListTurns(branchID, branchStore);
    branchStore.currentTurns = () => { throw new customerErrors.BranchNotFound() };

    assert.throws(
      useCase.execute,
      customerErrors.BranchNotFound
    );
  });

  test('invalid branch store while creating use case', () => {
    const branchID = 1;
    const branchStore = null;

    assert.throws(
      () => { new ListTurns(branchID, branchStore) },
      customerErrors.BranchStoreNotPresent
    );
  });

  test('invalid branch id while creating use case', () => {
    const branchID = null;
    const branchStore = new BranchStoreMock();

    assert.throws(
      () => { new ListTurns(branchID, branchStore) },
      customerErrors.BranchIDNotPresent
    );
  });
});

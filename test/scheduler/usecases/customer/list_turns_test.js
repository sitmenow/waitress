const { expect, assert } = require('chai');

const { BranchStoreMock } = require('./mocks');
const customerErrors = require('../../../../scheduler/usecases/customer/errors');
const ListTurns = require('../../../../scheduler/usecases/customer/list-turns');


suite('Customer List Turns', () => {

  suiteSetup(() => {});

  test('current turns in a restaurant branch', () => {
    const turns = [
      { id: 1 },
      { id: 2 },
    ];
    const branchStore = new BranchStoreMock(turns);
    const useCase = new ListTurns(branchStore);
    assert.deepEqual(turns, useCase.execute());
  });

  test('current turns not found for a restaurant', () => {
    const branchStore = new BranchStoreMock();
    const useCase = new ListTurns(branchStore);
    assert.throws(
      useCase.execute,
      customerErrors.TurnsNotFound
    );
  });
});

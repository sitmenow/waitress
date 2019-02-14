const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const CustomerListCoffeeTurns = require('../../../../scheduler/usecases/customer/list-coffee-turns');


suite('Use Case: Customer lists coffee turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branchStore = createBranchStore();
    turnStore = createTurnStore();

    branch = createBranch({
      id: 'Branch Test',
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('customer lists coffee turns', async () => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'findWaitingByBranchAndRequestedTimeRange')
      .returns(Promise.resolve([turn]));

    const useCase = new CustomerListCoffeeTurns({
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    const output = await useCase.execute();

    assert.isTrue(
      turnStore.findWaitingByBranchAndRequestedTimeRange.calledWith(
        branch.id, branch.lastOpeningTime, null
      )
    );
    assert.deepEqual([turn], output);
  });

  test('customer list customer turns for a non-existent branch', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new CustomerListCoffeeTurns({
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('when the branch is closed', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(false);

    const useCase = new CustomerListCoffeeTurns({
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsClosed);
        done();
      });
  });
});

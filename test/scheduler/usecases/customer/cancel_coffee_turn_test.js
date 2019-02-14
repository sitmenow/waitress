const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/customer/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const coreErrors = require('../../../../scheduler/errors');
const CustomerCancelCoffeeTurn = require('../../../../scheduler/usecases/customer/cancel-coffee-turn');


suite('Use Case: Customer cancel coffee turn', () => {
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

  test('customer cancels coffee turn', async () => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(true));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    const output = await useCase.execute();

    const expectedTurn = createTurn({
      branch,
      id: turn.id,
      name: turn.name,
      status: 'canceled',
      requestedTime: turn.requestedTime,
    });

    assert.isTrue(turnStore.update.calledWith(expectedTurn));
    assert.isTrue(output);
  });

  test('customer cancel non-existent turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnModelNotFound()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('customer cancels turn for a non-existent branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
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
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(false);

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
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

  test('when the turn is not allowed to change status', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isOpen')
      .returns(true);
    sandbox.stub(turn, 'cancel')
      .throws(new coreErrors.TurnNotAllowedToChangeStatus());

    const useCase = new CustomerCancelCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      branchStore,
      turnStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(coreErrors.TurnNotAllowedToChangeStatus);
        done();
      });
  });
});

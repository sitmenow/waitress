const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const Branch = require('../../../../scheduler/branch');
const Turn = require('../../../../scheduler/turn');
const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessRejectGasTurn = require('../../../../scheduler/usecases/hostess/reject-gas-turn');


suite('Use Case: Hostess rejects gas turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branchStore = createBranchStore();
    hostessStore = createHostessStore();
    turnStore = createTurnStore();

    hostessId = 'hostess-id';
    branchId = 'branch-id';
    turnId = 'turn-id';
    turnName = 'Turn Test';
    branch = createBranch({ branchId });
    hostess = createHostess({ hostessId, branch });
    turn = createTurn({ turnId, turnName, branch });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('hostes rejects gas turn', async () => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);
    sandbox.stub(turnStore, 'update')
      .returns(true);

    const expectedTurn = createTurn({
      turnId,
      turnName,
      branch,
      requestedTime: turn.requestedTime,
    });
    expectedTurn.reject();

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedTurn));
    assert.isTrue(output)
  });

  test('hostess rejects gas turn when the branch is closed', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('hostess rejects gas turn for some other branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    branch = createBranch({
      branchId: 'some-other-branch-id',
    });

    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchMissMatch);
        done();
      });
  });

  test('hostess rejects non-waiting gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    turn.reject();

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnIsNotWaiting);
        done();
      });
  });

  test('hostess rejects non-existent gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnNotFound()));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('hostess rejects gas turn for non-existent branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(
          useCaseErrors.HostessDoesNotBelongToAnyBranch
        );
        done();
      });
  });

  test('non-existent hostess rejects gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessNotFound()));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });

  test('hostess rejects gas turn but turn store cannot update turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(Turn.prototype, 'isWaiting')
      .returns(true);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.reject(new storeErrors.TurnNotUpdated()));

    const useCase = new HostessRejectGasTurn({
      turnId,
      hostessId,
      turnStore,
      hostessStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotRejected);
        done();
      });
  });
});

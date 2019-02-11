const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const Branch = require('../../../../scheduler/branch');
const Turn = require('../../../../scheduler/turn');
const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessServeGasTurn = require('../../../../scheduler/usecases/hostess/serve-gas-turn');


suite('Use Case: Hostess serves gas turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    branchStore = createBranchStore();
    hostessStore = createHostessStore();
    turnStore = createTurnStore();
    cacheStore = createCacheStore();

    branch = createBranch({
      id: 'turn-id',
    });
    hostess = createHostess({
      id: 'hostess-id',
      branch,
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch ,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('hostess serves gas turn', async () => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(turnStore, 'update')
      .returns(true);
    sandbox.stub(cacheStore, 'removeGasTurn')
      .returns(true);

    const expectedTurn = createTurn({
      id: turn.id,
      name: turn.name,
      status: 'served',
      requestedTime: turn.requestedTime,
      branch,
    });

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    await useCase.execute();

    assert.isTrue(turnStore.update.calledWith(expectedTurn));
    assert.isTrue(cacheStore.removeGasTurn.calledWith(expectedTurn.id));
  });

  test('hostess serves gas turn of some other branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    newBranch = createBranch({
      id: 'some-other-branch-id',
    });
    hostess = createHostess({
      id: hostess.id,
      branch: newBranch,
    });

    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(newBranch));

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: newBranch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(
          useCaseErrors.TurnDoesNotBelongToBranch
        );
        done();
      });
  });

  test('hostess serves gas turn for some other branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));

    newBranch = createBranch({
      id: 'some-other-branch-id',
    });

    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(newBranch));

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: newBranch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(
          useCaseErrors.HostessDoesNotBelongToBranch
        );
        done();
      });
  });

  test('hostess serves non-waiting gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    turn.serve();

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.UnableToServeTurn);
        done();
      });
  });

  test('hostess serves non-existent gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnModelNotFound()));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('hostess serves gas turn for non-existent branch', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('non-existent hostess serves gas turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessModelNotFound()));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });

  test('hostess serves gas turn but turn store cannot update turn', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(turnStore, 'update')
      .returns(Promise.reject(new storeErrors.TurnNotUpdated()));
    sandbox.stub(cacheStore, 'removeGasTurn')
      .returns(true);

    const useCase = new HostessServeGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotServed);
        done();
      });
  });
});

const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const schedulerErrors = require('../../../../scheduler/errors');
const HostessRejectCoffeeTurn = require('../../../../scheduler/usecases/hostess/reject-coffee-turn');

suite('Use Case: Hostess reject coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    turnStore = createTurnStore();
    turnCacheStore = createTurnCacheStore();
    branchStore = createBranchStore();
    hostessStore = createHostessStore();

    branch = createBranch({
      id: 'branch-id',
    });
    customer = createCustomer({
      id: 'customer-id',
    });
    hostess = createHostess({
      id: 'hostess-id',
      branch,
    });
    turn = createTurn({
      id: 'turn-id',
      name: 'Turn Test',
      branch,
      customer,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns the rejected coffee turn', async () => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnCacheStore, 'remove')
      .returns(Promise.resolve(turn));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    const output = await useCase.execute();

    assert.isTrue(turnStore.find.calledWith(turn.id));
    assert.isTrue(hostessStore.find.calledWith(hostess.id));
    assert.isTrue(branchStore.find.calledWith(branch.id));
    assert.isTrue(turnStore.update.calledWith(turn));
    assert.isTrue(turnCacheStore.remove.calledWith(turn.id));
    assert.deepEqual(turn, output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchModelNotFound()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating branch entity', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchEntityNotCreated()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessModelNotFound()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating hostess entity', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessEntityNotCreated()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a turn model not found error ' +
       'when the given turn id does not exist', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnModelNotFound()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating turn entity', (done) => {
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.reject(new storeErrors.TurnEntityNotCreated()));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a hostess does not belong to branch error ' +
       'when the given branch id does not match with hostess branch id', (done) => {
    hostess = createHostess({
      id: hostess.id,
      name: hostess.name,
      branch: createBranch({ id: 'different-branch-id' }),
    });

    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessDoesNotBelongToBranch);
        done();
      });
  });

  test('throws a turn does not belong to branch error ' +
       'when the given branch id does not match with turn branch id', (done) => {
    turn = createTurn({
      id: turn.id,
      name: turn.name,
      branch: createBranch({ id: 'different-branch-id' }),
      customer: turn.customer,
    });

    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnDoesNotBelongToBranch);
        done();
      });
  });

  test('throws a branch is closed error ' +
       'when the given branch is not open', (done) => {
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(schedulerErrors.BranchIsClosed);
        done();
      });
  });

  test('throws a turn not allowed to change status error ' +
       'when the given turn is not waiting', (done) => {
    turn = createTurn({
      id: turn.id,
      name: turn.name,
      requestedTime: turn.requestedTime,
      status: 'rejected',
      branch: turn.branch,
      customer: turn.customer,
    });

    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(turnStore, 'update')
      .returns(Promise.resolve(turn));
    sandbox.stub(turnCacheStore, 'remove')
      .returns(Promise.resolve(turn));

    const useCase = new HostessRejectCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      turnStore,
      hostessStore,
      branchStore,
      turnCacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(schedulerErrors.TurnNotAllowedToChangeStatus);
        done();
      });
  });
});

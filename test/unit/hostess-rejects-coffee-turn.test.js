const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const useCaseErrors = require('../../lib/hostess-errors');
const databaseErrors = require('../../lib/database/errors');
const schedulerErrors = require('../../lib/errors');
const HostessRejectsCoffeeTurn = require('../../lib/hostess-rejects-coffee-turn');

suite('Use Case: Hostess reject coffee turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

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
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'update')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.turnsCache, 'remove')
      .returns(Promise.resolve(turn));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    const output = await useCase.execute();

    assert.isTrue(database.turns.find.calledWith(turn.id));
    assert.isTrue(database.hostesses.find.calledWith(hostess.id));
    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.turns.update.calledWith(turn));
    assert.isTrue(database.turnsCache.remove.calledWith(turn.id));
    assert.deepEqual(turn, output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchModelNotFound()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating branch entity', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchEntityNotCreated()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.reject(new databaseErrors.HostessModelNotFound()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating hostess entity', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.reject(new databaseErrors.HostessEntityNotCreated()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotUpdated);
        done();
      });
  });

  test('throws a turn model not found error ' +
       'when the given turn id does not exist', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new databaseErrors.TurnModelNotFound()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotFound);
        done();
      });
  });

  test('throws a turn not updated error ' +
       'when an error occurs while creating turn entity', (done) => {
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new databaseErrors.TurnEntityNotCreated()));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
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

    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
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

    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnDoesNotBelongToBranch);
        done();
      });
  });

  test('throws a branch is closed error ' +
       'when the given branch is not open', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(true);

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
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

    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(branch, 'isClosed')
      .returns(false);
    sandbox.stub(database.turns, 'update')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.turnsCache, 'remove')
      .returns(Promise.resolve(turn));

    const useCase = new HostessRejectsCoffeeTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(schedulerErrors.TurnNotAllowedToChangeStatus);
        done();
      });
  });
});

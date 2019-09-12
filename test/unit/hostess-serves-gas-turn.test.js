const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const Branch = require('../../lib/branch');
const Turn = require('../../lib/turn');
const {
  TurnNotFound,
  BranchNotFound,
  HostessNotFound,
  TurnNotAllowedToChangeStatus } = require('../../lib/errors');
const {
  TurnModelNotFound,
  BranchModelNotFound,
  HostessModelNotFound } = require('../../lib/database/errors');
const HostessServesGasTurn = require('../../lib/hostess-serves-gas-turn');

suite('Use Case: Hostess serves gas turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

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
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.turns, 'update')
      .returns(true);
    sandbox.stub(database.cache, 'removeGasTurn')
      .returns(true);

    const expectedTurn = createTurn({
      id: turn.id,
      name: turn.name,
      status: 'served',
      requestedTime: turn.requestedTime,
      branch,
    });

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    await useCase.execute();

    assert.isTrue(database.turns.update.calledWith(expectedTurn));
    assert.isTrue(database.cache.removeGasTurn.calledWith(expectedTurn.id));
  });

  test('hostess serves gas turn of some other branch', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));

    newBranch = createBranch({
      id: 'some-other-branch-id',
    });
    hostess = createHostess({
      id: hostess.id,
      branch: newBranch,
    });

    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(newBranch));

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: newBranch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotFound);
        done();
      });
  });

  test('hostess serves gas turn for some other branch', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));

    newBranch = createBranch({
      id: 'some-other-branch-id',
    });

    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(newBranch));

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: newBranch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('hostess serves non-waiting gas turn', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    turn.serve();

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotAllowedToChangeStatus);
        done();
      });
  });

  test('hostess serves non-existent gas turn', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.reject(new TurnModelNotFound()));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(TurnNotFound);
        done();
      });
  });

  test('hostess serves gas turn for non-existent branch', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchModelNotFound()));

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('non-existent hostess serves gas turn', (done) => {
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.reject(new HostessModelNotFound()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessServesGasTurn({
      turnId: turn.id,
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(HostessNotFound);
        done();
      });
  });
});

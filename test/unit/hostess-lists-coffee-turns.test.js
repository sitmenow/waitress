const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const { BranchNotFound, HostessNotFound } = require('../../lib/errors');
const {
  BranchModelNotFound,
  HostessModelNotFound } = require('../../lib/database/errors');
const HostessListsCoffeeTurns = require('../../lib/hostess-lists-coffee-turns');

suite('Use Case: Hostess lists coffee turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    user = createUser({
      id: 'user-id',
    });
    branch = createBranch({
      id: 'branch-id',
    });
    hostess = createHostess({
      id: 'hostess-id',
      branch,
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

  test('returns coffee turns currently available in cache', async () => {
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.turnsCache, 'findByBranch')
      .returns(Promise.resolve([turn]));

    const useCase = new HostessListsCoffeeTurns({
      branchId: branch.id,
      userId: user.id,
      database,
    });

    const output = await useCase.execute();

    assert.isTrue(database.hostesses.findByUserId.calledWith(user.id));
    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.turnsCache.findByBranch.calledWith(branch.id));
    assert.deepEqual([turn], output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchModelNotFound()));

    const useCase = new HostessListsCoffeeTurns({
      branchId: branch.id,
      userId: user.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.reject(new HostessModelNotFound()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListsCoffeeTurns({
      branchId: branch.id,
      userId: user.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(HostessNotFound);
        done();
      });
  });

  test('throws a hostess does not belong to branch error ' +
       'when the given branch id does not match with hostess branch id', (done) => {
    branch = createBranch({
      id: 'different-branch-id',
    });

    sandbox.stub(database.hostesses, 'findByUserId')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListsCoffeeTurns({
      branchId: branch.id,
      userId: user.id,
      database,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  // TODO: Test HostessEntityNotCreated
  // TODO: Test BranchntityNotCreated
  // TODO: Test TurnEntityNotCreated
  // TODO: Test with limit
});

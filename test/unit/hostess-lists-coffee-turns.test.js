const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const databaseErrors = require('../../../../scheduler/database/errors');
const HostessListCoffeeTurns = require('../../../../scheduler/usecases/hostess/list-coffee-turns');

suite('Use Case: Hostess lists coffee turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

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
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.turnsCache, 'findByBranch')
      .returns(Promise.resolve([turn]));

    const useCase = new HostessListCoffeeTurns({
      branchId: branch.id,
      hostessId: hostess.id,
      database,
    });

    const output = await useCase.execute();

    assert.isTrue(database.hostesses.find.calledWith(hostess.id));
    assert.isTrue(database.branches.find.calledWith(branch.id));
    assert.isTrue(database.turnsCache.findByBranch.calledWith(branch.id));
    assert.deepEqual([turn], output);
  });

  test('throws a branch model not found error ' +
       'when the given branch id does not exist', (done) => {
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new databaseErrors.BranchModelNotFound()));

    const useCase = new HostessListCoffeeTurns({
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

  test('throws a hostess model not found error ' +
       'when the given hostess id does not exist', (done) => {
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.reject(new databaseErrors.HostessModelNotFound()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListCoffeeTurns({
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

  test('throws a hostess does not belong to branch error ' +
       'when the given branch id does not match with hostess branch id', (done) => {
    branch = createBranch({
      id: 'different-branch-id',
    });

    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListCoffeeTurns({
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

  // TODO: Test HostessEntityNotCreated
  // TODO: Test BranchntityNotCreated
  // TODO: Test TurnEntityNotCreated
  // TODO: Test with limit
});

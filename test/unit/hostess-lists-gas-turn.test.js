const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const { HostessNotFound, BranchNotFound } = require('../../lib/errors');
const {
  BranchModelNotFound,
  HostessModelNotFound } = require('../../lib/database/errors');
const HostessListsGasTurns = require('../../lib/hostess-lists-gas-turns');

suite('Use Case: Hostess lists gas turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    limit = 25;
    hostessId = 'hostess-id';
    branchId = 'branch-id';
    turnId = 'turn-id';
    turnName = 'Turn Test';
    branch = createBranch({ branchId });
    hostess = createHostess({ hostessId, branch });
    turn = createTurn({ branchId, turnId, turnName });
    cacheItem = { id: turnId, expectedArrivalTime: new Date() };
  });

  teardown(() => {
    sandbox.restore();
  });

  test('hostess lists gas turns', async () => {
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(database.cache, 'getBranchGasTurns')
      .returns(Promise.resolve([cacheItem]));
    sandbox.stub(database.turns, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new HostessListsGasTurns({
      branchId,
      hostessId,
      database,
      limit,
    });

    const output = await useCase.execute();

    assert.isTrue(database.cache.getBranchGasTurns.calledWith(branch.id, limit));
    assert.deepEqual([turn], output);
  });

  test('hostess list gas turns for a non-existent branch', (done) => {
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.reject(new BranchModelNotFound()));

    const useCase = new HostessListsGasTurns({
      branchId,
      hostessId,
      database,
      limit,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(BranchNotFound);
        done();
      });
  });

  test('non-existent hostess list gas turns', (done) => {
    sandbox.stub(database.hostesses, 'find')
      .returns(Promise.reject(new HostessModelNotFound()));
    sandbox.stub(database.branches, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListsGasTurns({
      branchId,
      hostessId,
      database,
      limit,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(HostessNotFound);
        done();
      });
  });
});

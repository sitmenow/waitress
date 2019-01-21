const sinon = require('sinon');
const { expect, assert } = require('chai');

require('../../test_helper');

const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessListGasTurns = require('../../../../scheduler/usecases/hostess/list-gas-turns');


suite('Use Case: Hostess lists gas turns', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    cacheStore = createCacheStore();
    branchStore = createBranchStore();
    hostessStore = createHostessStore();
    turnStore = createTurnStore();

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
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(cacheStore, 'getBranchGasTurns')
      .returns(Promise.resolve([cacheItem]));
    sandbox.stub(turnStore, 'find')
      .returns(Promise.resolve(turn));

    const useCase = new HostessListGasTurns({
      branchId,
      hostessId,
      hostessStore,
      branchStore,
      cacheStore,
      turnStore,
      limit,
    });

    const output = await useCase.execute();

    assert.isTrue(cacheStore.getBranchGasTurns.calledWith(branch.id, limit));
    assert.deepEqual([turn], output);
  });

  test('hostess list gas turns for a non-existent branch', (done) => {
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new HostessListGasTurns({
      branchId,
      hostessId,
      hostessStore,
      branchStore,
      cacheStore,
      turnStore,
      limit,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchNotFound);
        done();
      });
  });

  test('non-existent hostess list gas turns', (done) => {
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessNotFound()));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessListGasTurns({
      branchId,
      hostessId,
      hostessStore,
      branchStore,
      cacheStore,
      turnStore,
      limit,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });
});

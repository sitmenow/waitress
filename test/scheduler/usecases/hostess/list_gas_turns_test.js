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

    hostessId = 'hostess-id';
    branchId = 'branch-id';
    branch = createBranch({ branchId });
    hostess = createHostess({ hostessId, branch });
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
      .returns(true);

    const useCase = new HostessListGasTurns({
      hostessId,
      hostessStore,
      branchStore,
      cacheStore,
    });

    const output = await useCase.execute();

    assert.isTrue(cacheStore.getBranchGasTurns.calledWith(branch.id));
    assert.isTrue(output);
  });

  test('hostess list gas turns for a non-existent branch', (done) => {
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));
    sandbox.stub(cacheStore, 'getBranchGasTurns')
      .returns(true);

    const useCase = new HostessListGasTurns({
      hostessId,
      hostessStore,
      branchStore,
      cacheStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(
          useCaseErrors.HostessDoesNotBelongToAnyBranch
        );
        done();
      });
  });

  test('non-existent hostess list gas turns', (done) => {
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessNotFound()));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(cacheStore, 'getBranchGasTurns')
      .returns(true);

    const useCase = new HostessListGasTurns({
      hostessId,
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
});

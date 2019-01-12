const sinon = require('sinon');
const { expect, assert } = require('chai');
const tk = require('timekeeper');

require('../../test_helper');

const Branch = require('../../../../scheduler/branch');
const useCaseErrors = require('../../../../scheduler/usecases/hostess/errors');
const storeErrors = require('../../../../scheduler/stores/errors');
const HostessCreateTurn = require('../../../../scheduler/usecases/hostess/create-turn');


suite('Use Case: Hostess creates turn', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    customerStore = createCustomerStore();
    branchStore = createBranchStore();
    turnStore = createTurnStore();
    hostessStore = createHostessStore();

    hostessId = 'hostess-id';
    turnName = 'Turn';
    turnGuests = 6;
    schedule = createSchedule();
    restaurant = createRestaurant();
    branch = createBranch({ restaurant, schedule });
    hostess = createHostess({ hostessId, branch });
    defaultCustomer = createCustomer();
  });

  teardown(() => {
    sandbox.restore();
    tk.reset();
  });

  test('hostess creates a turn', async() =>{
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(turnStore, 'create')
      .returns(Promise.resolve(true));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const requestedTime = new Date();
    const expectedTurn = createTurn({
      turnName,
      turnGuests,
      branch,
      requestedTime,
      customer: defaultCustomer,
    });
    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    tk.freeze(requestedTime);
    const output = await useCase.execute();

    assert.isTrue(turnStore.create.calledWith(expectedTurn));
    assert.isTrue(output);  
  });

  test('hostess creates a turn when the branch is closed', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(false);

    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.BranchIsNotOpen);
        done();
      });
  });

  test('hostess creates a turn with null name', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const turnName = null;
    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.MissingTurnName);
        done();
      });
  });

  test('hostess creates a turn with empty name', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);

    const turnName = '';
    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.MissingTurnName);
        done();
      });
  });

  test('hostess creates a turn but default customer is not found', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.reject(new storeErrors.CustomerNotFound()));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));

    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.DefaultCustomerNotFound);
        done();
      });
  });

  test('non-existent hostess creates turn', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.reject(new storeErrors.HostessNotFound()));

    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessNotFound);
        done();
      });
  });

  test('hostess with no branch creates turn', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.reject(new storeErrors.BranchNotFound()));

    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.HostessDoesNotBelongToAnyBranch);
        done();
      });
  });

  test('hostess creates a turn but store throws error while creating turn', (done) => {
    sandbox.stub(customerStore, 'getDefaultCustomer')
      .returns(Promise.resolve(defaultCustomer));
    sandbox.stub(hostessStore, 'find')
      .returns(Promise.resolve(hostess));
    sandbox.stub(branchStore, 'find')
      .returns(Promise.resolve(branch));
    sandbox.stub(Branch.prototype, 'isOpen')
      .returns(true);
    sandbox.stub(turnStore, 'create')
      .rejects(new storeErrors.TurnNotCreated());

    const useCase = new HostessCreateTurn({
      hostessId,
      turnName,
      turnGuests,
      turnStore,
      hostessStore,
      customerStore,
      branchStore,
    });

    useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(useCaseErrors.TurnNotCreated);
        done();
      });
  });
});

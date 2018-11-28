const { assert } = require('chai');

const TurnStore = require('../../../../scheduler/stores/mongoose/turn');
const TurnModel = require('../../../../services/db/mongoose/models/turn');


suite('Mongoose TurnStore', () => {
  setup(() => {
    turnStore = new TurnStore();
  });

  suite('#create()', () => {});

  suite('#find()', () => {

    suiteSetup(() => {
      turnModel = new TurnModel();
      return turnModel.save();
    });

    suiteTeardown(() => {
      return turnModel.delete();
    });

    test('returns a branch with the given id', () => {
      // BranchModel.findById(branchModel._id)
      //   .then(_ => console.log(_));
    });

    test('throws a branch not found error', () => {
    });
  });

  suite('#findByBranch()', () => {
  });

  suite('#remove()', () => {});

  suite('#update()', () => {});
});

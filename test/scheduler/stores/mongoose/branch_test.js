const { assert } = require('chai');

const BranchStore = require('../../../../scheduler/stores/mongoose/branch');
const BranchModel = require('../../../../services/db/mongoose/models/branch');


suite('Mongoose BranchStore', () => {
  setup(() => {
    branchStore = new BranchStore();
  });

  suite('#create()', () => {});

  suite('#find()', () => {

    suiteSetup(() => {
      branchModel = new BranchModel();
      return branchModel.save();
    });

    suiteTeardown(() => {
      return branchModel.delete();
    });

    test('returns a branch with the given id', () => {
      // BranchModel.findById(branchModel._id)
      //   .then(_ => console.log(_));
    });

    test('throws a branch not found error', () => {
    });
  });

  suite('#remove()', () => {});

  suite('#update()', () => {});
});

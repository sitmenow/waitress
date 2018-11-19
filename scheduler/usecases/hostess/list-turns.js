const storeErrors = require('../../stores/errors');
const hostessUseCaseErrors = require('./errors');


class HostessListTurns {
  constructor(hostess, index, hostessStore, branchStore) {
    this.index = index;
    this.hostess = hostess;
    this.hostessStore = hostessStore;
    this.branchStore = branchStore;

    this._validate();
  }

  execute() {
    const hostess = this.hostessStore.find(this.hostess.id);
    if (!hostess) throw new hostessUseCaseErrors.HostessNotFound();

    if (!hostess.branch) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    }

    if (!hostess.branch.opened()) {
      throw new hostessUseCaseErrors.BranchIsNotOpen();
    }

    return this.branchStore.getCurrentTurns(hostess.branch.id, this.index);
  }

  _validate() {
    if (!this.hostess) {
      throw new hostessUseCaseErrors.HostessNotPresent();
    }

    if (!this.hostessStore) {
      throw new hostessUseCaseErrors.HostessStoreNotPresent();
    }

    if (!this.branchStore) {
      throw new hostessUseCaseErrors.BranchStoreNotPresent();
    }
  }
}

module.exports = HostessListTurns;

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
    return this.hostessStore.find(this.hostess.id)
      .then(hostess => this.branchStore.find(hostess.id))
      .then(branch => this._checkBranch(branch))
      .catch(error => this._manageError(error));
  }

  _checkBranch(branch) {
    if (!branch.isOpen()) {
      throw new hostessUseCaseErrors.BranchIsNotOpen();
    }

    return this.branchStore.getCurrentTurns(branch.id, this.index);
  }

  _manageError(error) {
    if (error instanceof storeErrors.HostessNotFound) {
       throw new hostessUseCaseErrors.HostessNotFound();
    } else if (error instanceof storeErrors.BranchNotFound) {
      throw new hostessUseCaseErrors.HostessDoesNotBelongToAnyBranch();
    }

    console.log(error);
    throw error;
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

const Branch = require('../../branch');
const Hostess = require('../../hostess');
const HostessModel = require('../../../services/db/mongoose/models/hostess');
const storeErrors = require('../errors');

class HostessStore {

  async create(hostess) {
  }

  async find(hostessId) {
    const model = await HostessModel.findById(hostessId);

    if (!model) throw new storeErrors.HostessNotFound(hostessId);

    return this._modelToObject(model);
  }

  update(hostess) {
  }

  _modelToObject(model) {
    let hostess = null;

    try {
      hostess = new Hostess({
        id: model.id,
        name: model.name,
        branch: new Branch({ id: model.branchId }),
      });
    } catch (error) {
      console.log(error)
      throw new storeErrors.HostessNotCreated();
    }

    return hostess;
  }
}

module.exports = HostessStore;

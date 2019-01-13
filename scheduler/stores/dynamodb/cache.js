const Turn = require('../../turn');
const Branch = require('../../branch');

const storeErrors = require('../errors');


class CacheStore {
  async getBranchGasTurns(branchId) {
  }

  _modelToObject(model) {
    /*
    let turn = null;

    try {
      turn = new Turn({
        id: model.id,
        name: model.name,
        guests: model.guests,
        requestedTime: model.requestedTime,
        branch: new Branch({ id: model.branchId.toString() }),
        customer: new Customer({ id: model.customerId.toString() }),
      });
    } catch (error) {
      throw new storeErrors.TurnNotCreated();
    }

    return turn;
    */
  }

  _objectToModel(turn) {
    /*
    let model = null;

    try {
      model = new TurnModel({
        name: turn.name,
        status: turn.status,
        guests: turn.guests,
        requestedTime: turn.requestedTime,
        expectedServiceTime: turn.expectedServiceTime,
        branchId: branch.id,
        customerId: customer.id,
      });
    } catch (error) {
      throw new storeErrors.TurnModelNotCreated();
    }

    return model;
  }
  */
}

module.exports = CacheStore;

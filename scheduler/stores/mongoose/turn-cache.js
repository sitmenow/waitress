const TurnStore = require('./turn');
const TurnCacheModel = require('../../../services/db/mongoose/models/turn-cache');
const errors = require('../errors');

class TurnCacheStore extends TurnStore {
  async create(turn) {
    const model = this._objectToModel(turn);

    await model.save();

    return model.id;
  }

  async find(turnId) {
    const model = await TurnCacheModel.findById(turnId);

    if (!model) throw new errors.TurnCacheModelNotFound(turnId);

    return this._modelToObject(model);
  }

  async findByBranch(branchId) {
    const turns = await TurnCacheModel.find({ branchId });
    //.find({ branchId }, null, { sort: { requestedTime: 1 }});

    return turns.map(this._modelToObject);
  }

  async findByCustomer(customerId) {
    const turns = await TurnCacheModel.find({ customerId });
    //.find({ branchId }, null, { sort: { requestedTime: 1 }});

    return turns.map(this._modelToObject);
  }

  async remove(turnId) {
    const turn = await this.find(turnId);

    const { ok } = await TurnCacheModel.deleteOne({ _id: turn.id });

    if (!ok) {
      throw new errors.TurnCacheModelNotRemoved(turn.id);
    }

    return turn;
  }

  _objectToModel(turn) {
    let model = null;

    try {
      model = new TurnCacheModel({
        _id: turn.id,
        name: turn.name,
        status: turn.status,
        updatedAt: turn.updatedAt,
        requestedTime: turn.requestedTime,
        expectedServiceTime: turn.expectedServiceTime,
        branchId: turn.branch.id,
        customerId: turn.customer.id,
        metadata: turn.metadata,
        expirationTime: turn.requestedTime,
      });

    } catch (error) {
      throw new errors.TurnCacheModelNotCreated(turn.id, error.stack);
    }

    return model;
  }
}

module.exports = TurnCacheStore;

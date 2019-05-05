const CacheModel = require('../../../db/mongoose/models/cache');
const storeErrors = require('../errors');


class CacheStore {
  async getBranchGasTurns(branchId, limit) {
    const models = await CacheModel.find({ branchId }).limit(limit);

    return models.map(model => ({
      id: model.id,
      expectedArrivalTime: model.expectedArrivalTime,
    }));
  }

  async updateGasTurn(turnId, expectedArrivalTime) {
    const model = await CacheModel.findById(turnId);

    if (!model) throw new storeErrors.TurnNotFound();

    model.expectedArrivalTime = expectedArrivalTime

    await model.save();
  }

  async createGasTurn(turnId, branchId) {
    const model = new CacheModel({
      _id: turnId,
      branchId,
    });

    await model.save();

    return model.id;
  }

  async removeGasTurn(turnId) {
    const model = await CacheModel.findById(turnId);

    if (!model) throw new storeErrors.TurnNotFound();

    await model.delete();
  }
}

module.exports = CacheStore;

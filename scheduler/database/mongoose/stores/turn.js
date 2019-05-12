const Turn = require('../../../turn');
const Branch = require('../../../branch');
const Customer = require('../../../customer');
const TurnModel = require('../../../../db/mongoose/models/turn');
const errors = require('../../errors');

class TurnStore {
  async create(turn) {
    const model = this._objectToModel(turn);

    await model.save();

    return model.id;
  }

  async find(turnId) {
    const model = await TurnModel.findById(turnId);

    if (!model) throw new errors.TurnModelNotFound(turnId);

    return this._modelToObject(model);
  }

  async update(turn) {
    const model = await TurnModel.findById(turn.id);

    if (!model) throw new errors.TurnModelNotFound(turn.id);

    model.name = turn.name;
    model.status = turn.status;
    model.updatedTime = turn.updatedTime;
    model.requestedTime = turn.requestedTime;
    model.expectedServiceTime = turn.expectedServiceTime;
    model.branchId = turn.branch.id;
    model.customerId = turn.customer.id;
    model.metadata = turn.metadata;

    // TODO: Test all possible errors ^

    await model.save();
  }

  async updateProperties(turn) {
    const model = await TurnModel.findById(turn.id);

    if (!model) throw new errors.TurnModelNotFound(turn.id);

    if (turn.name) {
      model.name = turn.name;
    }

    if (turn.status) {
      model.status = turn.status;
    }

    if (turn.updatedTime) {
      model.updatedTime = turn.updatedTime;
    }

    if (turn.requestedTime) {
      model.requestedTime = turn.requestedTime;
    }

    if (turn.expectedServiceTime) {
      model.expectedServiceTime = turn.expectedServiceTime;
    }

    if (turn.branch && turn.branch.id) {
      model.branchId = turn.branch.id;
    }

    if (turn.customer && turn.customer.id) {
      model.customerId = turn.customer.id;
    }

    if (turn.metadata) {
      model.metadata = turn.metadata;
    }

    await model.save();
  }

  async findByBranch(branchId) {
    const turns = await TurnModel.find({ branchId });

    return turns.map(this._modelToObject);
  }

  async findByBranchAndStatus(branchId, status) {
    const turns = await TurnModel.find({ branchId, status });

    return turns.map(this._modelToObject);
  }

  async findWaitingByBranchAndRequestedTimeRange(branchId, start, end) {
    const turns = await TurnModel.find({
      branchId,
      status: 'waiting',
      requestedTime: { $gte: start, $lte: end },
    })

    return turns.map(this._modelToObject);
  }

  _modelToObject(model) {
    let turn = null;

    try {
      turn = new Turn({
        id: model.id,
        name: model.name,
        status: model.status,
        updatedTime: model.updatedTime,
        requestedTime: model.requestedTime,
        expectedServiceTime: model.expectedServiceTime,
        metadata: model.metadata,
        branch: new Branch({ id: model.branchId.toString() }),
        customer: new Customer({ id: model.customerId.toString() }),
      });
    } catch (error) {
      throw new errors.TurnEntityNotCreated(model.id, error.stack);
    }

    return turn;
  }

  _objectToModel(turn) {
    let model = null;

    try {
      model = new TurnModel({
        name: turn.name,
        status: turn.status,
        updatedTime: turn.updatedTime,
        requestedTime: turn.requestedTime,
        expectedServiceTime: turn.expectedServiceTime,
        branchId: turn.branch.id,
        customerId: turn.customer.id,
        metadata: turn.metadata,
      });

    } catch (error) {
      throw new errors.TurnModelNotCreated(turn.id, error.stack);
    }

    return model;
  }
}

module.exports = TurnStore;

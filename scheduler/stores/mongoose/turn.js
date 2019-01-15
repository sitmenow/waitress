const Turn = require('../../turn');
const Branch = require('../../branch');
const Customer = require('../../customer');
const Schedule = require('../../schedule');
const TurnModel = require('../../../services/db/mongoose/models/turn');
const storeErrors = require('../errors');


class TurnStore {
  async create(turn) {
    const model = this._objectToModel(turn);
    await model.save();
    return model.id;
  }

  async find(turnId) {
    const model = await TurnModel.findById(turnId);

    if (!model) throw new storeErrors.TurnNotFound(turnId);

    return this._modelToObject(model);
  }

  async update(turn) {
    const model = await TurnModel.findById(turn.id);

    if (!model) throw new storeErrors.TurnNotFound(turn.id);

    model.name = turn.name;
    model.guests = turn.guests;
    model.status = turn.status;
    model.requestedTime = turn.requestedTime;
    model.expectedServiceTime = turn.expectedServiceTime;
    model.customerId = turn.customer.id;
    model.branchId = turn.branch.id;

    await model.save();
  }

  // En teoria nunca deberian quedar turnos en espera de ser atendidos
  // pero podria suceder que por ser ultimos clientes la hostess ya no
  // sirve o rechacha los turnos y quedan en espera eterna.
  //
  // Cada hora correr un job y los branches con schedules que esten cerrados
  // a esa hora sin sesiones activas, poner todos sus turnos como removed.
  async findByBranch(branchId, start, index) {
    const query = TurnModel.find({ branchId, requestedTime: { $gte: start }});
    const turns = await query.exec();

    return turns.map(model => this._modelToObject(model));
  }

  async findByBranchAndStatus(branchId, start, status, index) {}

  _modelToObject(model) {
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
  }

  _objectToModel(turn) {
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
}

module.exports = TurnStore;

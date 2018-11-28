const Turn = require('../../turn');
const Branch = require('../../branch');
const Customer = require('../../customer');
const TurnModel = require('../../../services/db/mongoose/models/turn');
const { TurnNotFound } = require('../errors');


class TurnStore {
  async create(turn) {
    model = this._objectToModel(branch);
    await model.save();
  }

  async find(turnId) {
    model = TurnModel.findById(turnId);

    if (!model) throw new TurnNotFound(turnId);

    return this._modelToObect(model);
  }

  async update(branch) {
  }

  // En teoria nunca deberian quedar turnos en espera de ser atendidos
  // pero podria suceder que por ser ultimos clientes la hostess ya no
  // registra su entrada y quedan esos turnos en espera eterna.
  //
  // Cada hora correr un job y los branches con schedules que esten cerrados
  // a esa hora sin sesiones activas, poner todos sus turnos como removed.
  async findByBranch(branchId, start, index) {
    const query = TurnModel.find({ branchId, requested_time: { $gte: start }});
    return await query.exec();
  }

  async findByBranchAndStatus(branchId, start, status, index) {}

  _modelToObject(model) {
    turn = null;

    try {
      turn = new Turn({
        id: model.id,
        schedule: new Schedule(),
      });
    } catch (error) {
      throw new TurnNotCreated();
    }

    return turn;
  }

  _objectToModel(turn) {
    model = null;

    try {
      model = new TurnModel(turn);
    } catch (error) {
      throw new TurnModelNotCreated();
    }

    return model;
  }
}

module.exports = TurnStore;

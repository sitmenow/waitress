const Turn = require('../../turn');
const Branch = require('../../branch');
const Customer = require('../../customer');
const Schedule = require('../../schedule');
const TurnModel = require('../../../services/db/mongoose/models/turn');
const storeErrors = require('../errors');


class TurnStore {
  async create(turn) {
    model = this._objectToModel(branch);
    await model.save();
    return model;
  }

  async find(turnId) {
    model = TurnModel.findById(turnId);

    if (!model) throw new storeErrors.TurnNotFound(turnId);

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
        requestedTime: model.requestedTime,
        branch: new Branch({
          id: model.branchId.toString(),
        }),
        customer: new Customer({
          id: model.customerId.toString(),
        }),
        schedule: new Schedule(),
      });
    } catch (error) {
      console.log(error)
      throw new storeErrors.TurnNotCreated();
    }

    return turn;
  }

  _objectToModel(turn) {
    model = null;

    try {
      model = new TurnModel(turn);
    } catch (error) {
      throw new storeErrors.TurnModelNotCreated();
    }

    return model;
  }
}

module.exports = TurnStore;
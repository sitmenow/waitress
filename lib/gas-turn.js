const Turn = require('./turn');


class GasTurn extends Turn {
  constructor(args) {
    super(args);

    this._plates = args.plates;
  }

  get plates() {
    return this._plates;
  }
}

module.exports = GasTurn;

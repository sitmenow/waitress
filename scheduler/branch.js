const errors = require('./errors');


class Branch {
  constructor({
    id,
    name,
    address,
    coordinates,
    lastOpeningTime,
    lastClosingTime,
    restaurant,
  } = {}) {
    this._id = id;
    this._name = name;
    this._address = address;
    this._coordinates = coordinates;
    this._lastOpeningTime = lastOpeningTime;
    this._lastClosingTime = lastClosingTime;
    this._restaurant = restaurant;
  }

  get id() {
    return this._id;
  }

  get restaurant() {
    return this._restaurant;
  }

  get lastOpeningTime() {
    return this._lastOpeningTime;
  }

  get lastClosingTime() {
    return this._lastClosingTime;
  }

  close() {
    if (this.isClosed()) {
      throw new errors.BranchAlreadyClosed();
    }

    this._lastOpeningTime = null;
    this._lastClosingTime = new Date();
    // TODO: Log this closing time
  }

  isClosed() {
    return !!this._lastClosingTime;
  }

  isOpen() {
    return !!this._lastOpeningTime;
  }

  open() {
    if (this.isOpen()) {
      throw new errors.BranchAlreadyOpen();
    }

    this._lastOpeningTime = new Date();
    this._lastClosingTime = null;
    // TODO: Log this opening time
  }
}


module.exports = Branch;

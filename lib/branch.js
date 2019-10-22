const { BranchAlreadyClosed, BranchAlreadyOpen } = require('./errors');

class Branch {
  constructor({
    id,
    name,
    address,
    coordinates,
    lastOpeningTime,
    lastClosingTime,
    picture,
    brand,
  } = {}) {
    this._id = id;
    this._name = name;
    this._address = address;
    this._coordinates = coordinates;
    this._lastOpeningTime = lastOpeningTime;
    this._lastClosingTime = lastClosingTime;
    this._picture = picture;
    this._brand = brand;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get picture() {
    return this._picture;
  }

  get coordinates() {
    return this._coordinates;
  }

  get brand() {
    return this._brand;
  }

  get lastOpeningTime() {
    return this._lastOpeningTime;
  }

  get lastClosingTime() {
    return this._lastClosingTime;
  }

  close() {
    if (this.isClosed()) {
      throw new BranchAlreadyClosed();
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
      throw new BranchAlreadyOpen();
    }

    this._lastOpeningTime = new Date();
    this._lastClosingTime = null;
    // TODO: Log this opening time
  }
}


module.exports = Branch;

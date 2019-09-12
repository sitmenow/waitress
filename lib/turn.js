const { TurnNotAllowedToChangeStatus } = require('./errors');

const SERVED = 'served';
const WAITING = 'waiting';
const ON_HOLD = 'on_hold';
const CANCELED = 'canceled';
const REMOVED = 'removed';
const REJECTED = 'rejected';

class Turn {
  constructor({
    id,
    name,
    status,
    requestedTime,
    expectedServiceTime,
    metadata,
    customer,
    branch
  }) {
    this._id = id;
    this._status = status || WAITING;
    this._requestedTime = requestedTime || new Date();
    this._metadata = metadata;
    this._customer = customer;
    this._branch = branch;

    this.name = name;
    this.expectedServiceTime = expectedServiceTime;
  }

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  get customer() {
    return this._customer;
  }

  get branch() {
    return this._branch;
  }

  get requestedTime() {
    return this._requestedTime;
  }

  get metadata() {
    return this._metadata;
  }

  serve() {
    if (this._status != WAITING && this._status != ON_HOLD) {
      throw new TurnNotAllowedToChangeStatus(this.id, this.status, SERVED);
    }

    this._status = SERVED;
  }

  hold() {
    if (this._status != WAITING) {
      throw new TurnNotAllowedToChangeStatus(this.id, this.status, ON_HOLD);
    }

    this._status = ON_HOLD;
  }

  cancel() {
    if (this._status != WAITING && this._status != ON_HOLD) {
      throw new TurnNotAllowedToChangeStatus(this.id, this.status, CANCELED);
    }

    this._status = CANCELED;
  }

  remove() {
    now = new Date();

    if (this._status != WAITING) {
      throw new TurnNotAllowedToChangeStatus(this.id, this.status, REMOVED);
    }

    if (this.expectedServiceTime < now) {
      throw new Error();
    }

    this._status = REMOVED;
  }

  reject() {
    if (this._status != WAITING && this._status != ON_HOLD) {
      throw new TurnNotAllowedToChangeStatus(this.id, this.status, REJECTED);
    }

    this._status = REJECTED;
  }

  isServed() {
    return this._status == SERVED;
  }

  isOnHold() {
    return this._status == ON_HOLD;
  }

  isCanceled() {
    return this._status == CANCELED;
  }

  isRemoved() {
    return this._status == REMOVED;
  }

  isRejected() {
    return this._status == REJECTED;
  }

  isWaiting() {
    return this._status == WAITING;
  }
}

module.exports = Turn;

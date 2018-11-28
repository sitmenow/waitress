class Turn {
  constructor({ id, name, status, requested_time, expected_service_time, customer, branch }) {
    this._id = id;
    this._status = status || Turn.WAITING;
    this._customer = customer;
    this._branch = branch;
    this._requested_time = requested_time;
    this.expected_service_time = expected_service_time;
    this.name = name;
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

  get requested_time() {
    return this._requested_time;
  }

  static get SERVED() {
    return 'served';
  }

  static get WAITING() {
    return 'waiting';
  }

  static get ON_HOLD() {
    return 'on_hold'
  }

  static get CANCELED() {
    return 'canceled';
  }

  static get REMOVED() {
    return 'removed';
  }

  static get REJECTED() {
    return 'rejected';
  }

  serve() {
    if (this._status != Turn.WAITING || this._status != Turn.ON_HOLD) {
      throw new Error();
    }

    this._status = Turn.SERVED;
  }

  hold() {
    if (this._status != Turn.WAITING) {
      throw new Error();
    }

    this._status = Turn.ON_HOLD;
  }

  cancel() {
    if (this._status != Turn.WAITING || this._status != Turn.ON_HOLD) {
      throw new Error();
    }

    this._status = Turn.CANCEL;
  }

  remove() {
    if (this._status != Turn.WAITING || !this._expected_service_time) {
      throw new Error();
    }

    this._status = Turn.REMOVED;
  }

  reject() {
    if (this._status != Turn.WAITING || this._status != Turn.ON_HOLD) {
      throw new Error();
    }

    this._status = Turn.REJECTED;
  }

  isServed() {
    return this._status == Turn.SERVED;
  }

  isOnHold() {
    return this._status == Turn.ON_HOLD;
  }

  isCanceled() {
    return this._status == Turn.CANCELED;
  }

  isRemoved() {
    return this._status == Turn.REMOVED;
  }

  isRejected() {
    return this._status == Turn.REJECTED;
  }
}

module.exports = Turn;

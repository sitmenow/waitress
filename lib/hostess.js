class Hostess {
  constructor({ id, user, branch }) {
    this._id = id;
    this._user = user;
    this._branch = branch;
  }

  get id() {
    return this._id;
  }

  get user() {
    return this._user;
  }

  get branch() {
    return this._branch;
  }
}

module.exports = Hostess;

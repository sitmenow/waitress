class Admin {
  constructor(id, user) {
    this._id = id;
    this._user = user;
  }

  get id() {
    return this._id;
  }

  get user() {
    return this._user;
  }
}

module.exports = Admin;

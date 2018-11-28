class Hostess {
  constructor({ id, branch }) {
    this._id = id;
    this._branch = branch;
    this.name = name;
  }

  get id() {
    return this._id;
  }

  get branch() {
    return this._branch;
  }
}

module.exports = Hostess;

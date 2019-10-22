class Brand {
  constructor({ id, name, picture }) {
    this._id = id;
    this._name = name;
    this._picture = picture;
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
}

module.exports = Brand;

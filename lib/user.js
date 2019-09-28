class User {
  constructor({ id, name, email, picture }) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._picture = picture;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get picture() {
    return this._picture;
  }

  get roles() {
    return this._roles;
  }
}

module.exports = User;

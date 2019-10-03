const User = require('./user');
const Customer = require('./customer');
const { CorruptedUser, UserExists, InvalidUser } = require('./errors');
const {
  CustomerModelNotCreated,
  UserModelNotFound,
  UserModelNotCreated,
  UserEntityNotCreated } = require('./database/errors');

class CoffeeUserSignsUp {
  constructor({ userId, username, email, picture, database }) {
    this.userId = userId;
    this.username = username;
    this.email =  email;
    this.picture = picture;
    this.database = database;
  }

  execute() {
    if (!this.userId) {
      return Promise.reject(
        new InvalidUser('new', 'id cannot be empty')
      );
    }

    if (!this.username) {
      return Promise.reject(
        new InvalidUser(this.userId, 'username cannot be empty')
      );
    }

    return this.database.users.find(this.userId)
      .then((user) => {
        throw new UserExists(user.id);
      })
      .catch((error) => {
        if (error instanceof UserModelNotFound) return;
        return Promise.reject(error);
      })
      .then(() => {
        const user = new User({
          id: this.userId,
          name: this.username,
          email: this.email,
          picture: this.picture,
        });

        return this.database.users.create(user)
          .then(() => {
            const customer = new Customer({ user });
            return this.database.customers.create(customer)
              .then(_ => user);
          });
      })
      .catch(error => this._manageError(error));
  }

  _manageError(error) {
    if (error instanceof UserModelNotCreated) {
      throw new Error('DB: User not created');
    } else if (error instanceof CustomerModelNotCreated) {
      throw new Error('DB: Customer not created');
    } else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser(error.entityId);
    }

    throw error;
  }
}

module.exports = CoffeeUserSignsUp;

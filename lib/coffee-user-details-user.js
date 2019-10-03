const User = require('./user');
const { UserNotFound, CorruptedUser } = require('./errors');
const {
  AdminModelNotFound,
  UserModelNotFound,
  UserModelNotCreated,
  UserEntityNotCreated } = require('./database/errors');

class CoffeeUserDetailsUser {
  constructor({ userId, requestedUserId, database }) {
    this.userId = userId;
    this.requestedUserId = requestedUserId;
    this.database = database;
  }

  execute() {
    return this.database.users.find(this.userId)
      .then((user) => {
        if (this.userId == this.requestedUserId) {
          return user;
        }

        return this.database.admins.findByUserId(this.userId)
          .catch((error) => {
            if (error instanceof AdminModelNotFound) {
              throw new UserNotFound(this.requestedUserId);
            }
            throw error;
          })
          .then(() => {
            return this.database.users.find(this.requestedUserId);
          });
      })
      .catch(error => this._manageError(error));
  }

  _manageError(error) {
    if (error instanceof UserModelNotFound) {
      throw new UserNotFound(error.modelId);
    } else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser(error.entityId);
    }

    throw error;
  }
}

module.exports = CoffeeUserDetailsUser;

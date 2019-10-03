const User = require('./user');
const {
  UserNotFound,
  CorruptedUser,
  CorruptedCustomer,
  CorruptedHostess,
  CorruptedAdmin } = require('./errors');
const {
  AdminModelNotFound,
  AdminEntityNotCreated,
  HostessModelNotFound,
  HostessEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  UserModelNotFound,
  UserEntityNotCreated } = require('./database/errors');

class CoffeeUserListsUserRoles {
  constructor({ userId, requestedUserId, database }) {
    this.userId = userId;
    this.requestedUserId = requestedUserId;
    this.database = database;
  }

  execute() {
    return this.database.users.find(this.userId)
      .then((user) => {
        if (this.userId == this.requestedUserId) {
          return this._listUserRoles(this.userId);
        }

        return this.database.admins.findByUserId(this.userId)
          .catch((error) => {
            if (error instanceof AdminModelNotFound) {
              throw new UserNotFound(this.requestedUserId);
            }
            throw error;
          })
          .then(() => this._listUserRoles(this.requestedUserId));
      })
      .catch(error => this._manageError(error));
  }

  _listUserRoles(userId) {
    const customer = this.database.customers.findByUserId(userId)
      .catch((error) => {
        if (error instanceof CustomerModelNotFound) return null;
        throw error;
      });
    const hostess = this.database.hostesses.findByUserId(userId)
      .catch((error) => {
        if (error instanceof HostessModelNotFound) return null;
        throw error;
      });
    const admin = this.database.admins.findByUserId(userId)
      .catch((error) => {
        if (error instanceof AdminModelNotFound) return null;
        throw error;
      });

    return Promise.all([customer, hostess, admin])
      .then(([customer, hostess, admin]) => {
        const roles = [];
        if (customer) roles.push(customer);
        if (hostess) roles.push(hostess);
        if (admin) roles.push(admin);
        return roles;
      });
  }

  _manageError(error) {
    if (error instanceof UserModelNotFound) {
      throw new UserNotFound(error.modelId);
    } else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser(error.entityId);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    } else if (error instanceof HostessEntityNotCreated) {
      throw new CorruptedHostess(error.entityId);
    } else if (error instanceof AdminEntityNotCreated) {
      throw new CorruptedAdmin(error.entityId);
    }

    throw error;
  }
}

module.exports = CoffeeUserListsUserRoles;

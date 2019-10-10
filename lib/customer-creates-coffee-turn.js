const Turn = require('./turn');
const Customer = require('./customer');
const {
  BranchNotAvailable,
  InvalidTurn,
  BranchNotFound,
  UserNotFound,
  TurnNotFound,
  CustomerNotFound,
  CorruptedCustomer,
  CorruptedTurn,
  CorruptedBranch,
  CorruptedUser,
  CustomerCreatesCoffeeTurnError } = require('./errors');
const {
  BranchModelNotFound,
  BranchEntityNotCreated,
  CustomerModelNotFound,
  CustomerEntityNotCreated,
  UserModelNotFound,
  UserEntityNotCreated,
  TurnModelNotFound,
  TurnEntityNotCreated } = require('./database/errors');

// TODO: Deny turn creation if the customer currently has
// a pending/active turn in the same branch
class CustomerCreatesCoffeeTurn {
  constructor({
    userId, branchId, product, name, database,
  }) {
    this.userId = userId;
    this.branchId = branchId;
    this.product = product;
    this.name = name;
    this.database = database;
  }

  execute() {
    const user = this.database.users.find(this.userId);
    const customer = this.database.customers.findByUserId(this.userId);
    const branch = this.database.branches.find(this.branchId);

    return Promise.all([user, customer, branch])
      .then(([user, customer, branch]) =>
        this._createCoffeeTurn(user, customer, branch)
      )
      .catch(error => this._manageError(error));
  }

  _createCoffeeTurn(user, customer, branch) {
    if (branch.isClosed()) {
      throw new BranchNotAvailable(branch.id);
    }

    if (!this.name && !user.name) {
      throw new InvalidTurn('new', 'name cannot be empty');
    }

    if (!this.product) {
      throw new InvalidTurn('new', 'product cannot be empty');
    }

    const turn = new Turn({
      branch,
      customer,
      name: this.name || user.name,
      metadata: {
        product: this.product,
      },
    });

    return this.database.turns.create(turn)
      .then((turnId) => {
        return this.database.turns.find(turnId)
          .then((storedTurn) => {
            return this.database.turnsCache.create(storedTurn)
              .then(_ => storedTurn)
          });
      });
  }

  _manageError(error) {
    if (error instanceof UserModelNotFound) {
      throw new UserNotFound(error.modelId);
    } else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser(error.modelId);
    } else if (error instanceof BranchModelNotFound) {
      throw new BranchNotFound(error.modelId);
    } else if (error instanceof BranchEntityNotCreated) {
      throw new CorruptedBranch(error.entityId);
    } else if (error instanceof CustomerModelNotFound) {
      throw new CustomerNotFound(error.modelId);
    } else if (error instanceof CustomerEntityNotCreated) {
      throw new CorruptedCustomer(error.entityId);
    } else if (error instanceof TurnModelNotFound) {
      throw new TurnNotFound(error.modelId);
    } else if (error instanceof TurnEntityNotCreated) {
      throw new CorruptedTurn(error.entityId);
    }
    /*
    else if (error instanceof TurnModelNotCreated) {
      throw new TurnNotCreated(); // Unknown error if comes from turn cache
    }
    */

    throw error;
  }
}

module.exports = CustomerCreatesCoffeeTurn;

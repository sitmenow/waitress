class BranchError extends Error {}

class BranchAlreadyOpen extends BranchError {}

class BranchAlreadyClosed extends BranchError {}

class BranchNotAvailable extends BranchError {
  constructor(branchId) {
    super(`Branch '${branchId}' is not available`);
  }
}

class UserError extends Error {}

class UserExists extends UserError {
  constructor(userId) {
    super(`User '${userId}' already exists`);
  }
}

class TurnError extends Error {}

class TurnNotAllowedToChangeStatus extends TurnError {
  constructor(id, current, requested) {
    super(`Turn ${id} cannot change status from ${current} to ${requested}`);
  }
}

class EntityNotFound extends Error {
  constructor(entityType, entityId) {
    super(`${entityType} '${entityId}' was not found`);
  }
}

class TurnNotFound extends EntityNotFound {
  constructor(turnId) {
    super('Turn', turnId);
  }
}

class BranchNotFound extends EntityNotFound {
  constructor(branchId) {
    super('Branch', branchId);
  }
}

class CustomerNotFound extends EntityNotFound {
  constructor(customerId) {
    super('Customer', customerId);
  }
}

class HostessNotFound extends EntityNotFound {
  constructor(hostessId) {
    super('Hostess', hostessId);
  }
}

class UserNotFound extends EntityNotFound {
  constructor(userId) {
    super('User', userId);
  }
}

class CorruptedEntity extends Error {
  constructor(entityType, entityId) {
    super(`${entityType} '${entityId}' is corrupted`);
  }
}

class CorruptedTurn extends CorruptedEntity {
  constructor(turnId) {
    super('Turn', turnId);
  }
}

class CorruptedBranch extends CorruptedEntity {
  constructor(branchId) {
    super('Branch', branchId);
  }
}

class CorruptedCustomer extends CorruptedEntity {
  constructor(customerId) {
    super('Customer', customerId);
  }
}

class CorruptedHostess extends CorruptedEntity {
  constructor(hostessId) {
    super('Hostess', hostessId);
  }
}

class CorruptedUser extends CorruptedEntity {
  constructor(userId) {
    super('User', userId);
  }
}

class UseCaseError extends Error {
  constructor(error) {
    this.origin = error;
  }
}

class CustomerCancelsCoffeeTurnError extends UseCaseError {
}

class CustomerCreatesCoffeeTurnError extends UseCaseError {
}

class InvalidEntity extends Error {
  constructor(entityType, entityId, message) {
    super(`${entityType} '${entityId}': ${message}`);
  }
}

class InvalidCustomer extends InvalidEntity {
  constructor(customerId, message) {
    super('Customer', customerId, message);
  }
}

class InvalidTurn extends InvalidEntity {
  constructor(turnId, message) {
    super('Turn', turnId, message);
  }
}

class InvalidUser extends InvalidEntity {
  constructor(userId, message) {
    super('User', userId, message);
  }
}

module.exports = {
  BranchAlreadyOpen,
  BranchAlreadyClosed,
  BranchNotAvailable,
  BranchNotFound,
  CorruptedBranch,

  TurnNotAllowedToChangeStatus,
  TurnNotFound,
  CorruptedTurn,
  InvalidTurn,

  CustomerNotFound,
  CorruptedCustomer,

  HostessNotFound,
  CorruptedHostess,

  UserNotFound,
  CorruptedUser,
  UserExists,
  InvalidUser,

  CustomerCancelsCoffeeTurnError,
  CustomerCreatesCoffeeTurnError,
};

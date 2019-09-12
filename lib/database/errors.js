class DatabaseError extends Error {}

class UnsupportedDatabaseDriver extends DatabaseError {
  constructor(driver) {
    super(`Database driver ${driver} is not supported`);
  }
}

class StoreError extends DatabaseError {}

class ModelNotFound extends StoreError {
  constructor(modelType, modelId) {
    super(`${modelType} '${modelId}' not found`);

    this.modelId = modelId;
  }
}

class TurnModelNotFound extends ModelNotFound {
  constructor(turnId) {
    super('Turn', turnId);
  }
}

class TurnCacheModelNotFound extends ModelNotFound {
  constructor(turnCacheId) {
    super('TurnCache', turnCacheId);
  }
}

class BranchModelNotFound extends ModelNotFound {
  constructor(branchId) {
    super('Branch', branchId);
  }
}

class CustomerModelNotFound extends ModelNotFound {
  constructor(customerId) {
    super('Customer', customerId);
  }
}

class HostessModelNotFound extends ModelNotFound {
  constructor(hostessId) {
    super('Hostess', hostessId);
  }
}

class EntityNotCreated extends StoreError {
  constructor(entityType, entityId, errorStack) {
    super(`${entityType} '${entityId}' not created: \n${errorStack}`);

    this.entityId = entityId;
  }
}

class TurnEntityNotCreated extends EntityNotCreated {
  constructor(turnId, errorStack) {
    super('Turn', turnId, errorStack);
  }
}

class BranchEntityNotCreated extends EntityNotCreated {
  constructor(branchId, errorStack) {
    super('Branch', branchId, errorStack);
  }
}

class CustomerEntityNotCreated extends EntityNotCreated {
  constructor(customerId, errorStack) {
    super('Customer', customerId, errorStack);
  }
}

class HostessEntityNotCreated extends EntityNotCreated {
  constructor(hostessId, errorStack) {
    super('Hostess', hostessId, errorStack);
  }
}

class ModelNotCreated extends StoreError {
  constructor(modelType, modelId, errorStack) {
    super(`${modelType} ${modelId} not created: \n${errorStack}`);

    this.modelId = modelId;
  }
}

class TurnModelNotCreated extends ModelNotCreated {
  constructor(turnId, errorStack) {
    super('Turn', turnId, errorStack);
  }
}

class TurnCacheModelNotCreated extends ModelNotCreated {
  constructor(turnCacheId, errorStack) {
    super('TurnCache', turnCacheId, errorStack);
  }
}

class BranchModelNotCreated extends ModelNotCreated {
  constructor(branchId, errorStack) {
    super('Branch', branchId, errorStack);
  }
}

class CustomerModelNotCreated extends ModelNotCreated {
  constructor(customerId, errorStack) {
    super('Customer', customerId, errorStack);
  }
}

class HostessModelNotCreated extends ModelNotCreated {
  constructor(hostessId, errorStack) {
    super('Hostess', hostessId, errorStack);
  }
}

class ModelNotUpdated extends StoreError {
  constructor(id, errorStack) {
    super(`Model ${id} not updated \n${errorStack}`);
  }
}

class TurnModelNotUpdated extends ModelNotUpdated {}

class ModelNotRemoved extends StoreError {
  constructor(id, errorStack) {
    super(`Model ${id} not removed \n${errorStack}`);
  }
}

class TurnCacheModelNotRemoved extends ModelNotRemoved {}

module.exports = {
  DatabaseError,
  UnsupportedDatabaseDriver,

  StoreError,

  TurnModelNotFound,
  TurnModelNotCreated,
  TurnModelNotUpdated,
  TurnEntityNotCreated,

  TurnCacheModelNotFound,
  TurnCacheModelNotCreated,
  TurnCacheModelNotRemoved,

  BranchModelNotFound,
  BranchModelNotCreated,
  BranchEntityNotCreated,

  CustomerModelNotFound,
  CustomerModelNotCreated,
  CustomerEntityNotCreated,

  HostessModelNotFound,
  HostessModelNotCreated,
  HostessEntityNotCreated,
};

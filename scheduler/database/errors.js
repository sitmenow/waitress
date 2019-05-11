class StoreError extends Error {}

class ModelNotFound extends StoreError {
  constructor(id) {
    super(`Model ${id} not found`);
  }
}

class TurnModelNotFound extends ModelNotFound {}
class TurnCacheModelNotFound extends ModelNotFound {}
class BranchModelNotFound extends ModelNotFound {}
class CustomerModelNotFound extends ModelNotFound {}
class HostessModelNotFound extends ModelNotFound {}

class EntityNotCreated extends StoreError {
  constructor(id, errorStack) {
    super(`Entity ${id} not created: \n${errorStack}`);
  }
}

class TurnEntityNotCreated extends EntityNotCreated {}
class BranchEntityNotCreated extends EntityNotCreated {}
class CustomerEntityNotCreated extends EntityNotCreated {}
class HostessEntityNotCreated extends EntityNotCreated {}

class ModelNotCreated extends StoreError {
  constructor(id, errorStack) {
    super(`Model ${id} not created: \n${errorStack}`);
  }
}

class TurnModelNotCreated extends ModelNotCreated {}
class TurnCacheModelNotCreated extends ModelNotCreated {}
class BranchModelNotCreated extends ModelNotCreated {}
class CustomerModelNotCreated extends ModelNotCreated {}
class HostessModelNotCreated extends ModelNotCreated {}

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

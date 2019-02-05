class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class CustomerNotCreated extends StoreError {}
class TurnNotFound extends StoreError {}
class TurnNotCreated extends StoreError {}
class TurnNotUpdated extends StoreError {}
class BranchNotCreated extends StoreError {}
class BranchModelNotCreated extends StoreError {}
class HostessNotFound extends StoreError {}
class HostessNotCreated extends StoreError {}


class ModelNotFound extends StoreError {
  constructor(id) {
    super(`Model ${id} not found`);
  }
}

class TurnModelNotFound extends ModelNotFound {}

class EntityNotCreated extends StoreError {
  constructor(id, errorStack) {
    super(`Entity ${id} not created: \n${errorStack}`);
  }
}

class TurnEntityNotCreated extends EntityNotCreated {}

class ModelNotCreated extends StoreError {
  constructor(id, errorStack) {
    super(`Model ${id} not created: \n${errorStack}`);
  }
}

class TurnModelNotCreated extends ModelNotCreated {}


module.exports = {
  StoreError,
  BranchNotFound,
  BranchNotCreated,
  BranchModelNotCreated,
  CustomerNotFound,
  CustomerNotCreated,
  TurnNotFound,
  TurnNotCreated,
  TurnNotUpdated,
  TurnModelNotCreated,
  HostessNotFound,
  HostessNotCreated,

  TurnModelNotFound,
  TurnModelNotCreated,
  TurnEntityNotCreated,
};

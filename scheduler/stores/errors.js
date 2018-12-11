class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class TurnNotFound extends StoreError {}
class TurnNotCreated extends StoreError {}
class TurnModelNotCreated extends StoreError {}
class BranchNotCreated extends StoreError {}
class BranchModelNotCreated extends StoreError {}

module.exports = {
  StoreError,
  BranchNotFound,
  BranchNotCreated,
  BranchModelNotCreated,
  CustomerNotFound,
  TurnNotFound,
  TurnNotCreated,
  TurnModelNotCreated,
};
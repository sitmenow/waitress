class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class CustomerNotCreated extends StoreError {}
class TurnNotFound extends StoreError {}
class TurnNotCreated extends StoreError {}
class TurnModelNotCreated extends StoreError {}
class BranchNotCreated extends StoreError {}
class BranchModelNotCreated extends StoreError {}
class HostessNotFound extends StoreError {}

module.exports = {
  StoreError,
  BranchNotFound,
  BranchNotCreated,
  BranchModelNotCreated,
  CustomerNotFound,
  CustomerNotCreated,
  TurnNotFound,
  TurnNotCreated,
  TurnModelNotCreated,
  HostessNotFound,
};

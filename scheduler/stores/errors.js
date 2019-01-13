class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class CustomerNotCreated extends StoreError {}
class TurnNotFound extends StoreError {}
class TurnNotCreated extends StoreError {}
class TurnNotUpdated extends StoreError {}
class TurnModelNotCreated extends StoreError {}
class BranchNotCreated extends StoreError {}
class BranchModelNotCreated extends StoreError {}
class HostessNotFound extends StoreError {}
class HostessNotCreated extends StoreError {}

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
};

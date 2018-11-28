class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class TurnNotFound extends StoreError {}
class BranchNotCreated extends StoreError {}

module.exports = {
  StoreError,
  BranchNotFound,
  BranchNotCreated,
  CustomerNotFound,
  TurnNotFound,
};

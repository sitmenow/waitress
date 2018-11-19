class StoreError extends Error {}
class BranchNotFound extends StoreError {}
class CustomerNotFound extends StoreError {}
class TurnNotFound extends StoreError {}

module.exports = {
  StoreError,
  BranchNotFound,
  CustomerNotFound,
  TurnNotFound,
};

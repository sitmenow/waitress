
class CustomerError extends Error {}
class BranchNotFound extends CustomerError {}
class BranchIDNotPresent extends CustomerError {}
class BranchStoreNotPresent extends CustomerError {}
class CustomerIDNotPresent extends CustomerError {}
class UnableToCreateTurn extends CustomerError {}
class UnableToListTurns extends CustomerError {}

module.exports = {
  CustomerError,
  BranchIDNotPresent,
  BranchStoreNotPresent,
  UnableToCreateTurn,
  UnableToListTurns,
  CustomerIDNotPresent,
};

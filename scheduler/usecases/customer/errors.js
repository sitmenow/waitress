class CustomerUseCaseError extends Error {}

class BranchNotFound extends CustomerUseCaseError {}
class CustomerNotFound extends CustomerUseCaseError {}

class BranchIDNotPresent extends CustomerUseCaseError {}
class CustomerIDNotPresent extends CustomerUseCaseError {}
class TurnIDNotPresent extends CustomerUseCaseError {}
class BranchStoreNotPresent extends CustomerUseCaseError {}
class CustomerStoreNotPresent extends CustomerUseCaseError {}


module.exports = {
  CustomerUseCaseError,
  BranchNotFound,
  CustomerNotFound,
  BranchIDNotPresent,
  CustomerIDNotPresent,
  TurnIDNotPresent,
  BranchStoreNotPresent,
  CustomerStoreNotPresent,
};

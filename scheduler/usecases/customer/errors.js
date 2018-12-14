class CustomerUseCaseError extends Error {}

class BranchNotFound extends CustomerUseCaseError {}
class CustomerNotFound extends CustomerUseCaseError {}

class BranchNotCreated extends CustomerUseCaseError {}
class CustomerNotCreated extends CustomerUseCaseError {}

class BranchIDNotPresent extends CustomerUseCaseError {}
class CustomerIDNotPresent extends CustomerUseCaseError {}
class TurnIDNotPresent extends CustomerUseCaseError {}
class BranchStoreNotPresent extends CustomerUseCaseError {}
class CustomerStoreNotPresent extends CustomerUseCaseError {}

class CustomerNotPresent extends CustomerUseCaseError {}
class BranchIsNotOpen extends CustomerUseCaseError {}

class TurnStoreNotPresent extends CustomerUseCaseError {}


module.exports = {
  CustomerUseCaseError,
  BranchNotFound,
  BranchNotCreated,
  CustomerNotFound,
  CustomerNotCreated,
  BranchIDNotPresent,
  CustomerIDNotPresent,
  TurnIDNotPresent,
  BranchStoreNotPresent,
  CustomerStoreNotPresent,
  BranchIsNotOpen,
  CustomerNotPresent,
  BranchNotCreated,
  TurnStoreNotPresent,
};

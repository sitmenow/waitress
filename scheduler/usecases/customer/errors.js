class CustomerUseCaseError extends Error {}

class BranchNotFound extends CustomerUseCaseError {}
class CustomerNotFound extends CustomerUseCaseError {}
class TurnNotFound extends CustomerUseCaseError {}

class BranchNotCreated extends CustomerUseCaseError {}
class CustomerNotCreated extends CustomerUseCaseError {}

class BranchStoreNotPresent extends CustomerUseCaseError {}
class CustomerStoreNotPresent extends CustomerUseCaseError {}
class TurnStoreNotPresent extends CustomerUseCaseError {}

class CustomerNotPresent extends CustomerUseCaseError {}
class BranchIsNotOpen extends CustomerUseCaseError {}

class TurnDoesNotBelongToCustomer extends CustomerUseCaseError {}
class InactiveTurn extends CustomerUseCaseError {}

module.exports = {
  CustomerUseCaseError,
  BranchNotFound,
  BranchNotCreated,
  TurnNotFound,
  CustomerNotFound,
  CustomerNotCreated,
  BranchStoreNotPresent,
  CustomerStoreNotPresent,
  BranchIsNotOpen,
  CustomerNotPresent,
  BranchNotCreated,
  TurnStoreNotPresent,
  TurnDoesNotBelongToCustomer,
  InactiveTurn,
};

class HostessUseCaseError extends Error {}
class UnableToListTurns extends HostessUseCaseError {}
class HostessNotFound extends HostessUseCaseError {}
class MissingTurnName extends HostessUseCaseError {}
class BranchIsNotOpen extends HostessUseCaseError {}
class DefaultCustomerNotFound extends HostessUseCaseError {}
class DefaultCustomerNotCreated extends HostessUseCaseError {}
class HostessDoesNotBelongToAnyBranch extends HostessUseCaseError {}
class TurnNotCreated extends HostessUseCaseError {}
class TurnNotServed extends HostessUseCaseError {}
class TurnIsNotWaiting extends HostessUseCaseError {}
class BranchMissMatch extends HostessUseCaseError {}
class BranchNotFound extends HostessUseCaseError {}
class TurnNotFound extends HostessUseCaseError {}


module.exports = {
  HostessUseCaseError,
  UnableToListTurns,
  HostessNotFound,
  MissingTurnName,
  BranchIsNotOpen,
  BranchMissMatch,
  BranchNotFound,
  DefaultCustomerNotFound,
  DefaultCustomerNotCreated,
  HostessDoesNotBelongToAnyBranch,
  TurnNotFound,
  TurnNotCreated,
  TurnNotServed,
  TurnIsNotWaiting,
};

class HostessUseCaseError extends Error {}
class UnableToListTurns extends HostessUseCaseError {}
class HostessNotFound extends HostessUseCaseError {}
class MissingTurnName extends HostessUseCaseError {}
class BranchIsNotOpen extends HostessUseCaseError {}
class DefaultCustomerNotFound extends HostessUseCaseError {}
class DefaultCustomerNotCreated extends HostessUseCaseError {}
class HostessDoesNotBelongToAnyBranch extends HostessUseCaseError {}
class HostessDoesNotBelongToBranch extends HostessUseCaseError {}
class TurnNotCreated extends HostessUseCaseError {}
class TurnNotServed extends HostessUseCaseError {}
class TurnNotRejected extends HostessUseCaseError {}
class TurnIsNotWaiting extends HostessUseCaseError {}
class BranchMissMatch extends HostessUseCaseError {}
class BranchNotFound extends HostessUseCaseError {}
class TurnNotFound extends HostessUseCaseError {}
class UnableToServeTurn extends HostessUseCaseError {}
class UnableToRejectTurn extends HostessUseCaseError {}
class TurnDoesNotBelongToBranch extends HostessUseCaseError {}


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
  HostessDoesNotBelongToBranch,
  TurnNotFound,
  TurnNotCreated,
  TurnNotServed,
  TurnNotRejected,
  TurnIsNotWaiting,
  UnableToServeTurn,
  UnableToRejectTurn,
  TurnDoesNotBelongToBranch,
};

class HostessUseCaseError extends Error {}
class UnableToListTurns extends HostessUseCaseError {}
class HostessNotFound extends HostessUseCaseError {}
class MissingTurnName extends HostessUseCaseError {}
class BranchIsNotOpen extends HostessUseCaseError {}
class DefaultCustomerNotFound extends HostessUseCaseError {}
class DefaultCustomerNotCreated extends HostessUseCaseError {}
class HostessDoesNotBelongToAnyBranch extends HostessUseCaseError {}
class TurnNotCreated extends HostessUseCaseError {}

module.exports = {
  HostessUseCaseError,
  UnableToListTurns,
  HostessNotFound,
  MissingTurnName,
  BranchIsNotOpen,
  DefaultCustomerNotFound,
  DefaultCustomerNotCreated,
  HostessDoesNotBelongToAnyBranch,
  TurnNotCreated,
};

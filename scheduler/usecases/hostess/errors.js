class HostessUseCaseError extends Error {}

class HostessNotFound extends HostessUseCaseError {}
class BranchIsNotOpen extends HostessUseCaseError {}
class HostessDoesNotBelongToBranch extends HostessUseCaseError {}
class TurnNotCreated extends HostessUseCaseError {}
class TurnNotServed extends HostessUseCaseError {}
class TurnNotRejected extends HostessUseCaseError {}
class TurnNotUpdated extends HostessUseCaseError {}
class BranchNotFound extends HostessUseCaseError {}
class TurnNotFound extends HostessUseCaseError {}
class TurnDoesNotBelongToBranch extends HostessUseCaseError {}


module.exports = {
  HostessUseCaseError,

  BranchIsNotOpen,

  HostessNotFound,
  BranchNotFound,
  TurnNotFound,
  TurnNotCreated,
  TurnNotServed,
  TurnNotRejected,
  TurnNotUpdated,

  HostessDoesNotBelongToBranch,
  TurnDoesNotBelongToBranch,
};

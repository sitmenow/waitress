class HostessUseCaseError extends Error {}
class UnableToListTurns extends HostessUseCaseError {}
class HostessNotFound extends HostessUseCaseError {}
class MissingTurnName extends HostessUseCaseError {}

module.exports = {
  HostessUseCaseError,
  UnableToListTurns,
  HostessNotFound,
  MissingTurnName,
};

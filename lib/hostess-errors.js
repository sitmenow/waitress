class HostessUseCaseError extends Error {}

class NotFound extends HostessUseCaseError {
  constructor(element, id) {
    super(`${element} '${id}' not found`);
  }
}

class BranchNotFound extends NotFound {
  constructor(branchId) {
    super('Branch', branchId);
  }
}

class CustomerNotFound extends NotFound {
  constructor(customerId) {
    super('Customer', customerId);
  }
}

class TurnNotFound extends NotFound {
  constructor(turnId) {
    super('Turn', turnId);
  }
}

class HostessNotFound extends NotFound {
  constructor(hostessId) {
    super('Hostess', hostessId);
  }
}

class BranchIsNotOpen extends HostessUseCaseError {}
class HostessDoesNotBelongToBranch extends HostessUseCaseError {}
class TurnDoesNotBelongToBranch extends HostessUseCaseError {}

class TurnNotCreated extends HostessUseCaseError {}
class TurnNotServed extends HostessUseCaseError {}
class TurnNotRejected extends HostessUseCaseError {}
class TurnNotUpdated extends HostessUseCaseError {}


module.exports = {
  HostessUseCaseError,

  BranchIsNotOpen,

  HostessNotFound,
  BranchNotFound,
  CustomerNotFound,
  TurnNotFound,
  TurnNotCreated,
  TurnNotServed,
  TurnNotRejected,
  TurnNotUpdated,

  HostessDoesNotBelongToBranch,
  TurnDoesNotBelongToBranch,
};

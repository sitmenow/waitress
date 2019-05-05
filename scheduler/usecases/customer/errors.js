class CustomerUseCaseError extends Error {}

class NotFound extends CustomerUseCaseError {
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

class NotCreated extends CustomerUseCaseError {
  constructor(element, id) {
    super(`${element} '${id}' not created`);
  }
}

class BranchNotCreated extends NotCreated {
  constructor(branchId) {
    super('Branch', branchId);
  }
}

class CustomerNotCreated extends NotCreated {
  constructor(customerId) {
    super('Customer', customerId);
  }
}

class TurnNotCreated extends NotCreated {
  constructor(turnId) {
    super('Turn', turnId);
  }
}

class BranchIsNotOpen extends CustomerUseCaseError {}

class BranchIsClosed extends CustomerUseCaseError {
  constructor(branchId, branchLastClosingTime) {
    super(`Branch '${branchId}' was closed on ${branchLastClosingTime}`);
  }
} 

class TurnDoesNotBelongToCustomer extends CustomerUseCaseError {}
class InactiveTurn extends CustomerUseCaseError {}

class TurnNotUpdated extends CustomerUseCaseError {}


/******* gas stations *********/
class TurnRequiresPlates extends CustomerUseCaseError {}
class TurnRequiresIdentifier extends CustomerUseCaseError {}


/************* coffe errors ***********/
class InvalidCustomerName extends CustomerUseCaseError {
  constructor(customerId) {
    super(`Invalid customer id: ${customerId}`);
  }
}

class InvalidCustomerElection extends CustomerUseCaseError {
  constructor(customerName, customerElection) {
    super(
      `Invalid election '${customerElection}' from customer '${customerName}'`
    );
  }
}

class InvalidTurnId extends CustomerUseCaseError {
  constructor(turnId) {
    super(`Invalid turn id: ${turnId}`);
  }
}
/*************************************/


module.exports = {
  CustomerUseCaseError,

  BranchNotFound,
  TurnNotFound,
  CustomerNotFound,

  BranchNotCreated,
  TurnNotCreated,
  BranchNotCreated,
  CustomerNotCreated,

  BranchIsNotOpen,
  TurnDoesNotBelongToCustomer,
  InactiveTurn,

  BranchIsClosed,

/******* gas stations *********/
  TurnRequiresPlates,
  TurnRequiresIdentifier,

  // Cofee errors
  InvalidCustomerName,
  InvalidCustomerElection,
  InvalidTurnId,

  TurnNotUpdated,
};

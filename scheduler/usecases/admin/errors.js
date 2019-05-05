class AdminUseCaseError extends Error {}

class NotFound extends AdminUseCaseError {
  constructor(element, id) {
    super(`${element} '${id}' not found`);
  }
}

class SlackCustomerNotFound extends NotFound {
  constructor(channel, username) {
    super('SlackCustomer', `${channel}_${username}`);
  }
}

class NotCreated extends AdminUseCaseError {
  constructor(element, id) {
    super(`${element} '${id}' not created`);
  }
}

class CustomerNotCreated extends NotCreated {
  constructor(id) {
    super('Customer', id);
  }
}

module.exports = {
  SlackCustomerNotFound,

  CustomerNotCreated,
};

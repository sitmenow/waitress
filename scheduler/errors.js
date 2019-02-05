class SchedulerError extends Error {}

class BranchError extends SchedulerError {}
class BranchAlreadyOpen extends BranchError {}
class BranchAlreadyClosed extends BranchError {}

class TurnError extends SchedulerError {}

class TurnNotAllowedToChangeStatus extends TurnError {
  constructor(id, current, requested) {
    super(`Turn ${id} cannot change status from ${current} to ${requested}`);
  }
}

module.exports = {
  BranchAlreadyOpen,
  BranchAlreadyClosed,

  TurnNotAllowedToChangeStatus,
};

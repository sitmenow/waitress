class SchedulerError extends Error {}

class BranchError extends SchedulerError {}
class BranchAlreadyOpen extends BranchError {}
class BranchAlreadyClosed extends BranchError {}

class TurnError extends SchedulerError {}
class TurnMustBeWaitingToBeServed extends TurnError {}
class TurnMustBeWaitingToBeRejected extends TurnError {}
class TurnMustBeWaitingToBeOnHold extends TurnError {}
class TurnMustBeWaitingToBeRemoved extends TurnError {}
class TurnMustBeWaitingToBeCancelled extends TurnError {}

module.exports = {
  BranchAlreadyOpen,
  BranchAlreadyClosed,

  TurnMustBeWaitingToBeServed,
  TurnMustBeWaitingToBeRejected,
  TurnMustBeWaitingToBeOnHold,
  TurnMustBeWaitingToBeRemoved,
  TurnMustBeWaitingToBeCancelled,
};

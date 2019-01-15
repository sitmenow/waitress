class SchedulerError extends Error {}

class BranchError extends SchedulerError {}
class BranchAlreadyOpen extends BranchError {}
class BranchAlreadyClosed extends BranchError {}

module.exports = {
  BranchAlreadyOpen,
  BranchAlreadyClosed,
};

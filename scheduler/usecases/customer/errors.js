
class CustomerError extends Error {}
class BranchNotFound extends CustomerError {}
class BranchIDNotPresent extends CustomerError {}
class BranchStoreNotPresent extends CustomerError {}

module.exports = {
  BranchNotFound,
  BranchIDNotPresent,
  BranchStoreNotPresent,
};

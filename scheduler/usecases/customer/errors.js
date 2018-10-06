
class CustomerError extends Error {}
class TurnsNotFound extends CustomerError {}

module.exports = {
  TurnsNotFound,
};

const Turn = require('../../../turn');
const Branch = require('../../../branch');
const Customer = require('../../../customer');
const errors = require('../../errors');

class TurnStore {
  async create(turn) {
  }

  async find(turnId) {
  }

  async update(turn) {
  }

  async updateProperties(turn) {
  }

  async findByBranch(branchId) {
  }

  async findByBranchAndStatus(branchId, status) {
  }

  async findWaitingByBranchAndRequestedTimeRange(branchId, start, end) {
  }
}

module.exports = TurnStore;

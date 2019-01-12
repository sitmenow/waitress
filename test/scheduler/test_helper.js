const Turn = require('../../scheduler/turn');
const Branch = require('../../scheduler/branch');
const Restaurant = require('../../scheduler/restaurant');
const Schedule = require('../../scheduler/schedule');
const Hostess = require('../../scheduler/hostess');
const Customer = require('../../scheduler/customer');

const TurnStore = require('../../scheduler/stores/turn')
const BranchStore = require('../../scheduler/stores/branch')
const CustomerStore = require('../../scheduler/stores/customer')
const HostessStore = require('../../scheduler/stores/hostess')


before(() => {
  createBranch = ({ branchId, branchName, restaurant, schedule } = {}) => {
    branchName = branchName || 'Branch'

    return new Branch({
      id: branchId,
      name: branchName,
      restaurant,
      schedule
    });
  };

  createCustomer = ({ customerId, customerName } = {}) => {
    customerName = customerName || 'Customer'

    return new Customer({
      id: customerId,
      name: customerName,
    });
  };

  createSchedule = ({ week } = {}) => {
    week = week || {
      sunday: [[9, 20]],
      monday: [[9, 20]],
      tuesday: [[9, 20]],
      wednesday: [[9, 20]],
      thursday: [[9, 20]],
      friday: [[9, 20]],
      saturday: [[9, 20]],
    };

    return new Schedule(week);
  };

  createTurn = ({
    turnId, turnName, turnGuests, turnStatus, customer, branch,
    requestedTime, expectedServiceTime
  }) => {
    // id should keep the same
    turnName = turnName || 'Turn'

    return new Turn({
      id: turnId,
      name: turnName,
      guests: turnGuests,
      status: turnStatus,
      customer,
      branch,
      requestedTime,
      expectedServiceTime
    });
  };

  createHostess = ({ hostessId, hostessName, branch } = {}) => {
    hostessName = hostessName || 'Hostess';

    return new Hostess({
      id: hostessId,
      name: hostessName,
      branch,
    });
  } ;

  createRestaurant = ({ restaurantId, restaurantName } = {}) => {
    restaurantName = restaurantName || 'Restaurant';

    return new Restaurant({
      id: restaurantId,
      name: restaurantName,
    });
  };

  createTurnStore = () => new TurnStore();

  createHostessStore = () => new HostessStore();

  createBranchStore = () => new BranchStore();

  createCustomerStore = () => new CustomerStore();
});



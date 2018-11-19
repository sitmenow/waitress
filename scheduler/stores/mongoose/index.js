const dbService = require('../../../services/db/typeorm');
const TurnStore = require('./turn');
const HostessStore = require('./hostess');
const AdminStore = require('./admin');


module.exports = config => {
  const connection = dbService(config);

  return {
    turn: TurnStore(connection),
    admin: AdminStore(connection),
    hostess: HostessStore(connection),
  };
};

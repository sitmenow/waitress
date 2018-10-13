const TurnStore = require('./turn');
const HostessStore = require('./hostess');
const AdminStore = require('.admin');


const stores = {
  typeorm: config => require('./typeorm')(config),
  sequelize: config => require('./sequelize')(config),
  postgres: config => require('./postgres')(config),
};

function create(config) {
  const store = stores[config.id];

  if (!store) throw new Error('Store config ID does not exist');

  const {
    turn,
    admin,
    hostess
  } = store(config);

  return {
    turn: TurnStore(turn),
    admin: AdminStore(admin),
    hostess: HostessStore(hostess),
  };
}

module.exports = { create };

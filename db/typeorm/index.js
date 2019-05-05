const { createConnection } = require('typeorm');

const Admin = require('./schema/admin');
const Hostess = require('./schema/hostess');
const Turn = require('./schema/turn');

/*
 Postgres
 --------
 url - Connection url where perform connection to.
 host - Database host.
 port - Database host port. Default postgres port is 5432.
 username - Database username.
 password - Database password.
 database - Database name.
 schema - Schema name. Default is "public".
 ssl - Object with ssl parameters. See TLS/SSL.
*/

module.exports = config => await createConnection({
  type: config.type || 'postgres',
  host: config.host,
  port: config.port || 5432,
  username: config.username,
  password: config.password,
  database: config.database,
  schema: config.schema || 'public',
  entities: [
    Admin,
    Hostess,
    Customer,
    Turn,
    Restaurant,
    Branch,
  ],
});

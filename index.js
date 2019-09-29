// require('dotenv').config()
const config = require('config');

const db = require('./lib/database');
const useCases = require('./lib');
const api = require('./api/coffee');

const database = db.create(config.services.db);
const app = api(database, useCases);


app.disable('x-powered-by')
app.listen(config.api.port)
console.log("Waitress listening on ", config.api.port);

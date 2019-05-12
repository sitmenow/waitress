// require('dotenv').config()
const config = require('config');

const db = require('./scheduler/database');
const useCases = require('./scheduler/usecases');
const api = require('./api/coffee');

const database = db.create(config.services.db);
const app = api(database, useCases);


app.disable('x-powered-by')
app.listen(config.api.port)
console.log("Waitress listening on ", config.api.port);

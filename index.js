const config = require('config');
const express = require('express');

const scheduler = require('./scheduler');


var app = express();

// 
// Create routes

app.listen(config.api.port)


// Setup express app
// Setup sequelize
// Setup passport (for api tokens)
//
// Setup use cases and then pass them to the controllers


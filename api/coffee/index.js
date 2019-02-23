const express = require('express');
const config = require('config');

const middlewares = require('./middlewares');


const app = express();

// app.use(middlewares.cors);
app.use(express.json());


// -> list options
// -> create turn
// -> cancel turn
// -> list turns
// -> detail turn
// <- serve turn
// <- reject turn
// <- prepare turn

module.exports = (stores, useCases) => {

  app.post('/v1/slack/coffee', function(req, res) {
    res.send({ challenge: req.body.challenge });
  });

  return app;
};

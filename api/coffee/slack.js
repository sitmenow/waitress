const config = require('config');
const express = require('express');
const { createEventAdapter } = require('@slack/events-api');

const middlewares = require('./middlewares');


const app = express();
const slackEvents = createEventAdapter('');

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL that was configured earlier
app.use('/v1/slack/coffee', slackEvents.expressMiddleware());
// app.use(express.json());

// command
// list mutuo-rooftop turns
// list mutuo-rooftop options
// create mutuo-rooftop turn ''
// detail mutuo-rooftop turn turn-id   -> Only user can see
// cancel mutuo-rooftop turn           -> Only user can see

// Customer
// -> list options
// -> create turn
// -> cancel turn
// -> list turns
// -> detail turn
// -> detail last turn

// Barista/Hostess
// <- serve turn
// <- reject turn
// <- prepare turn

// Ah que pillo! Ese turno no es tuyo.
// Venga, loco! Ese turno no existe.
// No se de que hablas, lo siento.

module.exports = (stores, useCases) => {

  // app.post('/v1/slack/coffee', function(req, res) {
  //   // Challenge request
  //   res.send({ challenge: req.body.challenge });
  // });


  // Attach listeners to events by Slack Event "type"
  // See: https://api.slack.com/events/message.im
  slackEvents.on('message', (event) => {
    console.log(
      `Received a message event: user ${event.user} ` + 
      `in channel ${event.channel} says ${event.text}`
    );

    const sentence = event.text.split();
    const command = sentence.shift();
    const branchSlug = sentence.shift();
    const target = sentence.shift();
    const parameters = sentence.join(' ').trim();



    




    console.log(event);

  });

  // Handle errors (see `errorCodes` export)
  slackEvents.on('error', console.error);

  return app;
};

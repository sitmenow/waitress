const express = require('express');


const app = express();


module.exports = (stores, useCases) => {

  app.get('/gasolineras', function(req, res) {
    // Customer -> List gas stations
    // Dispatcher -> Block | List gas stations
    // const branches = stores.branchStore.all();
    // res.send(JSON.stringify(branches));
  });

  app.get('/gasolineras/:gasStationId', function(req, res) {
    // Customer -> Detail gas station
    // Dispatcher -> Block | Detail gas station
  });

  app.put('/gasolineras/:gasStationId', function(req, res) {
    // Customer -> Block
    // Dispatcher -> Enable/Disable own gas station
  });

  app.get('/gasolineras/:gasStationId/turnos', function(req, res) {
    // Customer -> Summary of turns
    // Dispatcher -> List own turns
  });

  app.post('/gasolineras/:gasStationId/turnos', function(req, res) {
    // Customer -> Create turn
    // Dispatcher -> Block
  });

  app.get('/gasolineras/:gasStationId/turnos/:turnId', function(req, res) {
    // Customer -> Detail turn & summary of turns
    // Dispatcher -> Block
  });

  app.put('/gasolineras/:gasStationId/turnos/:turnId', function(req, res) {
    // Customer -> Cancel turn
    // Dispatcher -> Serve/Reject turn if own turn
  });

  app.post('/token', function(req, res) {});

  return app;
};

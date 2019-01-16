const express = require('express');


const app = express();


module.exports = (stores, useCases) => {

  app.get('/gasolineras', function(req, res) {
    // Customer -> List gas stations
    // Dispatcher -> Block | List gas stations
    stores.branchStore.all()
      .then(branches => res.json(branches))
      .catch(error => res.json(error))
  });

  app.get('/gasolineras/:gasStationId', function(req, res) {
    // Customer -> Detail gas station
    // Dispatcher -> Block | Detail gas station
    stores.branchStore.find(req.params.gasStationId)
      .then(branch => res.json(branch))
      .catch(error => res.json(error))
  });

  app.put('/gasolineras/:gasStationId', function(req, res) {
    // Customer -> Block
    // Dispatcher -> Enable/Disable own gas station
    stores.branchStore.find(req.params.gasStationId)
      .then(branch => {
        if (branch.isOpen()) branch.close();
        else branch.open();
        stores.branchStore.update(branch);
        res.json(branch);
      })
      .catch(error => res.json(error))
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

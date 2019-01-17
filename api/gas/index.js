const express = require('express');


const app = express();

app.use(express.json());


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
    useCase = new useCases.CustomerListGasTurns({
      branchId: req.params.gasStationId,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
    });

    useCase.execute()
      .then(turns => res.json(turns))
      .catch(error => { console.log(error); res.json(error)});
    // Dispatcher -> List own turns
  });

  app.post('/gasolineras/:gasStationId/turnos', function(req, res) {
    // Customer -> Create turn
    useCase = new useCases.CustomerCreateGasTurn({
      turnName: req.body.name,
      turnEmailAddress: req.body.email_address,
      turnPlates: req.body.plates,
      branchId: req.params.gasStationId,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
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

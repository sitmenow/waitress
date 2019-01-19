const express = require('express');


const app = express();

app.use(express.json());


module.exports = (stores, useCases) => {

  app.get('/gasStations', function(req, res) {
    // Customer -> List gas stations
    // Dispatcher -> Block | List gas stations
    stores.branchStore.all()
      .then(branches => res.json(branches))
      .catch(error => res.json(error))
  });

  app.get('/gasStations/:gasStationId', function(req, res) {
    // Customer -> Detail gas station
    // Dispatcher -> Block | Detail gas station
    const useCase = new useCases.CustomerDetailGasStation({
      branchId: req.params.gasStationId,
      turnStore: stores.turnStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(gasStation => res.json(gasStation))
      .catch(error => {
        console.log(error);
        res.json(error)
      })
  });

  app.put('/gasStations/:gasStationId', function(req, res) {
    // Customer -> Block
    // Dispatcher -> Enable/Disable own gas station
    const useCase = new useCases.HostessToggleGasStation({
      branchId: req.params.gasStationId,
      hostessId: req.body.hostess_id,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(_ => res.json(_))
      .catch(error => res.json(error))
  });

  app.get('/gasStations/:gasStationId/turns', function(req, res) {
    // Customer -> Summary of turns
    const useCase = new useCases.CustomerListGasTurns({
      branchId: req.params.gasStationId,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
    });

    useCase.execute()
      .then(turns => res.json(turns))
      .catch(error => { console.log(error); res.json(error)});
    // Dispatcher -> List own turns
  });

  app.post('/gasStations/:gasStationId/turns', function(req, res) {
    // Customer -> Create turn
    const useCase = new useCases.CustomerCreateGasTurn({
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

  app.get('/gasStations/:gasStationId/turns/:turnId', function(req, res) {
    // Customer -> Detail turn & summary of turns
    // Dispatcher -> Block
    const useCase = new useCases.CustomerDetailGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      turnStore: stores.turnStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => res.json(error));

  });

  // Customer -> Cancel turn

  app.put('/gasStations/:gasStationId/turns/:turnId/serve', function(req, res) {
    // Dispatcher -> Serve turn if own turn
    stores.hostessStore.all().then(_ => console.log(_))
    const useCase = new useCases.HostessServeGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      hostessId: req.body.hostess_id,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  app.put('/gasStations/:gasStationId/turns/:turnId/reject', function(req, res) {
    // Dispatcher -> Serve/Reject turn if own turn
    const useCase = new useCases.HostessRejectGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      hostessId: req.body.hostess_id,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  app.post('/token', function(req, res) {});

  return app;
};

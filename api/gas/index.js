const express = require('express');
const config = require('config');

const middlewares = require('./middlewares');


const app = express();

app.use(middlewares.cors);
app.use(express.json());


module.exports = (stores, useCases) => {
  app.get('/gasStations', function(req, res) {
    stores.branchStore.all()
      .then(branches => res.json(branches))
      .catch(error => res.json(error))
  });

  app.get('/gasStations/:gasStationId', function(req, res) {
    const useCase = new useCases.CustomerDetailGasStation({
      branchId: req.params.gasStationId,
      cacheStore: stores.cacheStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(gasStation => res.json(gasStation))
      .catch(error => {
        console.log(error);
        res.json(error)
      })
  });

  /*
  app.get('/gasStations/:gasStationId/turns', function(req, res) {
    const useCase = new useCases.CustomerListGasTurns({
      branchId: req.params.gasStationId,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turns => res.json(turns))
      .catch(error => { console.log(error); res.json(error)});
  });
  */

  app.post('/gasStations/:gasStationId/turns', function(req, res) {
    const useCase = new useCases.CustomerCreateGasTurn({
      turnName: req.body.name,
      turnEmailAddress: req.body.email_address,
      turnPlates: req.body.plates,
      branchId: req.params.gasStationId,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  app.get('/gasStations/:gasStationId/turns/:turnId', function(req, res) {
    const useCase = new useCases.CustomerDetailGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      turnStore: stores.turnStore,
      branchStore: stores.branchStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => res.json(error));

  });

  app.put('/gasStations/:gasStationId', middlewares.auth, function(req, res) {
    const useCase = new useCases.HostessToggleGasStation({
      branchId: req.params.gasStationId,
      hostessId: config.entities.hostess || req.user.sub,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
    });

    useCase.execute()
      .then(_ => res.json(_))
      .catch(error => res.json(error))
  });

  app.get('/gasStations/:gasStationId/turns', middlewares.auth, function(req, res) {
    const useCase = new useCases.HostessListGasTurns({
      branchId: req.params.gasStationId,
      hostessId: config.entities.hostess || req.user.sub,
      branchStore: stores.branchStore,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  // Customer -> Cancel turn

  app.put('/gasStations/:gasStationId/turns/:turnId/serve', middlewares.auth, function(req, res) {
    const useCase = new useCases.HostessServeGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      hostessId: config.entities.hostess || req.user.sub,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  app.put('/gasStations/:gasStationId/turns/:turnId/reject', middlewares.auth, function(req, res) {
    const useCase = new useCases.HostessRejectGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      hostessId: config.entities.hostess || req.user.sub,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  app.put('/gasStations/:gasStationId/turns/:turnId/await', middlewares.auth, function(req, res) {
    const useCase = new useCases.HostessAwaitGasTurn({
      turnId: req.params.turnId,
      branchId: req.params.gasStationId,
      hostessId: config.entities.hostess || req.user.sub,
      turnStore: stores.turnStore,
      hostessStore: stores.hostessStore,
      branchStore: stores.branchStore,
      cacheStore: stores.cacheStore,
    });

    useCase.execute()
      .then(turn => res.json(turn))
      .catch(error => { console.log(error); res.json(error) });
  });

  return app;
};

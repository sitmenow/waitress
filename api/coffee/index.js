const express = require('express');
const config = require('config');

const middlewares = require('./middlewares');


const app = express();

app.use(middlewares.cors);
app.use(express.json());
app.use(middlewares.auth);


module.exports = (database, useCases) => {

  app.post('/v1/users', function(req, res){
    const useCase = new useCases.CoffeeUserSignsUp({
      userId: req.user.sub,
      username: req.body.name,
      email: req.body.email,
      picture: req.body.picture,
      database,
    });

    useCase.execute()
      .then((user) => {
        res.status(201);
        res.json({
          // Serialization
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message })
      });
  });

  app.use(middlewares.user(database));

  app.get('/v1/users/:userId', function(req, res) {
    const useCase = new useCases.CoffeeUserDetailsUser({
      userId: req.user.id,
      requestedUserId: req.params.userId,
      database,
    });

    useCase.execute()
      .then(user => res.json({
        id: user.id,
        name: user.name,
        roles: user.roles,
      }))
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  app.get('/v1/users/:userId/roles', function(req, res) {
    const useCase = new useCases.CoffeeUserListsUserRoles({
      userId: req.user.id,
      requestedUserId: req.params.userId,
      database,
    });

    useCase.execute()
      .then(roles => res.json({
        roles: roles.map((role) => ({
          id: role.id,
          type: 'customer',
        })),
      }))
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      })
  });

  // Customer | Admin
  app.get('/v1/brands', function(req, res) {
    res.send();
  });

  // Admin only
  app.get('/v1/brands/:brandId', function(req, res) {
    res.send();
  });

  // Customer | Admin
  app.get('/v1/brands/:brandId/branches', function(req, res) {
    res.send();
  });

  // Customer | Admin | Hostess
  app.get('/v1/brands/:brandId/branches/:branchId', function(req, res) {
    // Customer needs info about his/her turns ?customerId=X
    res.send();
  });

  // Admin | Hostess ... Maybe customer but that will affect the endpoint above
  app.get('/v1/brands/:brandId/branches/:branchId/turns', function(req, res) {
    const useCase = new useCases.HostessListsCoffeeTurns({
      // branchId: req.params.branchId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      database,
    });

    useCase.execute()
      .then((turns) => {
        turns = turns.map((turn) => {
          turn.name = turn.name.split('_').pop();
          return turn;
        });
        res.send(turns);
      })
      .catch(manageAPIError(res));
  });

  // Customer | Hostess
  app.get('/v1/brands/:brandId/branches/:branchId/turns/:turnId', function(req, res) {
    res.send();
  });

  // Customer | Hostess
  app.post('/v1/brands/:brandId/branches/:branchId/turns', function(req, res) {
    res.send();
  });

  // Customer | Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/cancel', function(req, res) {
    res.send();
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/prepare', function(req, res) {
    database.turns.find(req.params.turnId)
      .then((turn) => {
        return database.customers.find(turn.customer.id)
          .then((customer) => {
            const channel = customer.name.split('_').shift();
            // _callSlack(channel)(`Tu orden ${turn.id} esta siendo preparada: ${turn.metadata.product}`);
          });
      })
      .catch(manageAPIError(res))
      .then(_ => res.json({}));
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/unprepare', function(req, res) {
    database.turns.find(req.params.turnId)
      .then((turn) => {
        return database.customers.find(turn.customer.id)
          .then((customer) => {
            const channel = customer.name.split('_').shift();
            // _callSlack(channel)(`Tu orden ${turn.id} esta de nuevo en espera: ${turn.metadata.product}`);
          });
      })
      .catch(manageAPIError(res))
      .then(_ => res.json({}));
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/serve', function(req, res) {
    const useCase = new useCases.HostessServesCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      database,
    });

    useCase.execute()
      .then((turn) => {
        res.send(turn);
        return turn;
      })
      .catch(manageAPIError(res))
      .then((turn) => {
        const channel = turn.name.split('_').shift();
        console.log(turn, channel)
        // _callSlack(channel)(`Tu orden ${turn.id} esta lista`);
      });
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/reject', function(req, res) {
    const useCase = new useCases.HostessRejectsCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      database,
    });

    useCase.execute()
      .then((turn) => {
        res.send(turn);

        const channel = turn.customer.name.split('_').unshift();
        // _callSlack(channel)(`Tu orden ${turn.id} fue cancelada: ${turn.metadata.product}`);
      })
      .catch(manageAPIError(res));
  });

  return app;
};

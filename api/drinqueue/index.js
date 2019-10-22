const express = require('express');
const config = require('config');

const middlewares = require('./middlewares');
const { UserNotFound } = require('../../lib/errors')


const app = express();

app.use(middlewares.cors);
app.use(express.json());
app.use(middlewares.auth);


module.exports = (database, useCases) => {

  // Create User
  app.post('/v1/users', function(req, res){
    const useCase = new useCases.CoffeeUserSignsUp({
      userId: req.user.sub,
      username: req.body.name,
      email: req.body.email,
      picture: req.body.picture,
      database,
    });

    return useCase.execute()
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

  // Get user
  //  - Admins can get any user
  //  - Normal users can only see their own info
  app.get('/v1/users/:userId', function(req, res) {
    const useCase = new useCases.CoffeeUserDetailsUser({
      userId: req.user.id,
      requestedUserId: req.params.userId,
      database,
    });

    return useCase.execute()
      .then(user => res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      }))
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Get user roles
  //  - Admins can get any user roles
  //  - Normal users can only see their own roles
  app.get('/v1/users/:userId/roles', function(req, res) {
    const useCase = new useCases.CoffeeUserListsUserRoles({
      userId: req.user.id,
      requestedUserId: req.params.userId,
      database,
    });

    return useCase.execute()
      .then(roles => res.json(roles.map((role) => ({
          id: role.id,
          type: role.constructor.name.toLowerCase(),
        })),
      ))
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      })
  });

  // Customer | Admin
  // Get user active turns
  //  - Admin can get any user turns
  //  - Normal users can only see their own active turns
  app.get('/v1/users/:userId/turns', function(req, res) {
    if (req.params.userId != req.user.id) {
      const error = new UserNotFound(req.params.userId);
      res.status(404);
      res.json({ message: error.message });
      return;
    }

    const useCase = new useCases.CustomerListsActiveCoffeeTurns({
      userId: req.user.id,
      database,
    });

    return useCase.execute()
      .then((turns) => {
        res.json(turns.map(turn => ({
          id: turn.id,
          name: turn.name,
          status: turn.status,
          requestedTime: turn.requestedTime,
          metadata: turn.metadata,
          branch: {
            id: turn.branch.id,
          },
          customer: {
            id: turn.customer.id,
          },
        })));
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Get branches
  //  - Customer get all near branches
  //  - Admin get all branches
  //  - Owner get all branches under his/her brands
  //  - Barista get all branches he/her works at
  app.get('/v1/branches', function(req, res) {
    const useCase = new useCases.CustomerListsBranches({
      userId: req.user.id,
      radius: null,
      database,
    });

    return useCase.execute()
      .then(branches =>
        res.json(
          branches.map(branch => ({
            id: branch.id,
            name: branch.name,
            picture: branch.picture,
            coordinates: branch.coordinates,
            // lastOpeningTime:
            // lastClosingTime:
            // isOpen:
            brand: {
              id: branch.brand.id,
              name: branch.brand.name,
              picture: branch.brand.picture,
            },
          }))
        )
      )
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
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
      branchId: req.params.branchId,
      userId: req.user.id,
      database,
    });

    return useCase.execute()
      .then(turns =>
        res.send(
          turns.map(turn => ({
            id: turn.id,
            name: turn.name,
            status: turn.status,
            requestedTime: turn.requestedTime,
            metadata: turn.metadata,
            branch: {
              id: turn.branch.id,
            },
            customer: {
              id: turn.customer.id,
            },
          }))
        )
      )
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Customer | Hostess
  app.post('/v1/brands/:brandId/branches/:branchId/turns', function(req, res) {
    let useCase;
    const role = req.params.role;

    switch (role) {
    case 'barista':
      useCase = new useCases.HostessCreatesCoffeeTurn({
        branchId: req.params.branchId,
        product: req.params.product,
        name: req.params.name,
        database,
      });
      break;
    default:
      useCase = new useCases.CustomerCreatesCoffeeTurn({
        userId: req.user.id,
        branchId: req.params.branchId,
        product: req.body.product,
        name: req.body.name,
        database,
      });
    }

    return useCase.execute()
      .then((turn) => {
        res.status(201);
        res.json({
          id: turn.id,
          name: turn.name,
          status: turn.status,
          requestedTime: turn.requestedTime,
          metadata: turn.metadata,
          branch: {
            id: turn.branch.id,
          },
          customer: {
            id: turn.customer.id,
          },
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Customer | Hostess
  app.get('/v1/brands/:brandId/branches/:branchId/turns/:turnId', function(req, res) {
    res.send();
  });

  // Customer | Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/cancel', function(req, res) {
    const useCase = new useCases.CustomerCancelsCoffeeTurn({
      userId: req.user.id,
      branchId: req.params.branchId,
      turnId: req.params.turnId,
      database,
    });

    return useCase.execute()
      .then((turn) => {
        res.status(200);
        res.json({
          id: turn.id,
          name: turn.name,
          status: turn.status,
          requestedTime: turn.requestedTime,
          metadata: turn.metadata,
          branch: {
            id: turn.branch.id,
          },
          customer: {
            id: turn.customer.id,
          },
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/prepare', function(req, res) {
    res.json({});
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/unprepare', function(req, res) {
    res.json({});
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/serve', function(req, res) {
    const useCase = new useCases.HostessServesCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      userId: req.user.id,
      database,
    });

    return useCase.execute()
      .then((turn) => {
        res.json({
          id: turn.id,
          name: turn.name,
          status: turn.status,
          requestedTime: turn.requestedTime,
          metadata: turn.metadata,
          branch: {
            id: turn.branch.id,
          },
          customer: {
            id: turn.customer.id,
          },
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/reject', function(req, res) {
    const useCase = new useCases.HostessRejectsCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      userId: req.user.id,
      database,
    });

    return useCase.execute()
      .then((turn) => {
        res.json({
          id: turn.id,
          name: turn.name,
          status: turn.status,
          requestedTime: turn.requestedTime,
          metadata: turn.metadata,
          branch: {
            id: turn.branch.id,
          },
          customer: {
            id: turn.customer.id,
          },
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  });

  return app;
};

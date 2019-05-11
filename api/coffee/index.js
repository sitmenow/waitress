const express = require('express');
const config = require('config');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

const middlewares = require('./middlewares');

const app = express();
const slackEvents = createEventAdapter(config.services.slack.events.secret);
const slackWebClient = new WebClient(config.services.slack.web.oauthToken);
const slackBotClient = new WebClient(config.services.slack.web.botToken);

app.use(middlewares.cors);
app.use('/v1/slack/coffee', slackEvents.expressMiddleware());
app.use(express.json());
app.use(middlewares.auth);

const BRANCH_ID = config.branchId;

module.exports = (stores, useCases) => {

  // Slack only
  // app.post('/v1/slack/coffeea', function(req, res) {
  //   res.send({ challenge: req.body.challenge });
  // });

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
    const useCase = new useCases.HostessListCoffeeTurns({
      // branchId: req.params.branchId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      branchStore: stores.branchStore,
      hostessStore: stores.hostessStore,
      turnCacheStore: stores.turnCacheStore,
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
    stores.turnStore.find(req.params.turnId)
      .then((turn) => {
        return stores.customerStore.find(turn.customer.id)
          .then((customer) => {
            const channel = customer.name.split('_').shift();
            _callSlack(channel)(`Tu orden ${turn.id} esta siendo preparada: ${turn.metadata.product}`);
          });
      })
      .catch(manageAPIError(res))
      .then(_ => res.json({}));
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/unprepare', function(req, res) {
    stores.turnStore.find(req.params.turnId)
      .then((turn) => {
        return stores.customerStore.find(turn.customer.id)
          .then((customer) => {
            const channel = customer.name.split('_').shift();
            _callSlack(channel)(`Tu orden ${turn.id} esta de nuevo en espera: ${turn.metadata.product}`);
          });
      })
      .catch(manageAPIError(res))
      .then(_ => res.json({}));
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/serve', function(req, res) {
    const useCase = new useCases.HostessServeCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      branchStore: stores.branchStore,
      hostessStore: stores.hostessStore,
      turnCacheStore: stores.turnCacheStore,
      turnStore: stores.turnStore,
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
        _callSlack(channel)(`Tu orden ${turn.id} esta lista`);
      });
  });

  // Hostess
  app.put('/v1/brands/:brandId/branches/:branchId/turns/:turnId/reject', function(req, res) {
    const useCase = new useCases.HostessRejectCoffeeTurn({
      turnId: req.params.turnId,
      branchId: req.params.branchId,
      hostessId: req.user.profile,
      branchStore: stores.branchStore,
      hostessStore: stores.hostessStore,
      turnCacheStore: stores.turnCacheStore,
      turnStore: stores.turnStore,
    });

    useCase.execute()
      .then((turn) => {
        res.send(turn);

        const channel = turn.customer.name.split('_').unshift();
        _callSlack(channel)(`Tu orden ${turn.id} fue cancelada: ${turn.metadata.product}`);
      })
      .catch(manageAPIError(res));
  });


  // Handle errors (see `errorCodes` export)
  slackEvents.on('error', console.error);

  slackEvents.on('message', async (event) => {
    /*
    {
      client_msg_id: '6E68B278-8E30-45DE-990C-683DB6505566',
      type: 'message',
      text: 'Turno mutuo terraza latte caliente deslactosada',
      user: 'U9CMVGLN4',
      ts: '1556169652.002800',
      channel: 'DGGG19QAJ',
      event_ts: '1556169652.002800',
      channel_type: 'im'
    }
    */

    console.log(event)
    if (event.bot_id) return;

    const sentence = event.text.toLowerCase().split(' ');

    if (sentence.length < 4) return _callSlack(event.channel)('Seas mamooooon!');

    // order | cancel
    const command = sentence.shift();

    // mutuo
    const brandName = sentence.shift();

    // terraza | lobby
    const branchName = sentence.shift();

    if (sentence.length > 6) return _callSlack(event.channel)('Seas mamooooon!');
    // Whatever..
    const product = sentence.join(' ').trim();

    // slackWebClient.auth.test()
    //   .catch(error => console.log(error))

    let slackUser;

    try {
      slackUser = await slackWebClient.users.profile.get({
        user: event.user,
      });
    } catch(error) {
      console.log(error);
      return;
    }

    let message;
    const callSlack = _callSlack(event.channel);

    const userName = `${event.channel}_${slackUser.profile.real_name_normalized}`;
    // Look for customer, if not exists create it
    const customer = await _getCustomer(userName) || await _createCustomer(userName);

    if (command === 'order') {
      message = await order(customer, product); // Avoid multiple orders in a same branch
    } else if (command == 'cancel') {
      message = await cancel(customer, product); // Cancel last order in branch
    } else if (command == 'detail-branch') {
      message = detailBranch(customer);
    } else if (command == 'list-branches') {
      message = listBranches();
    } else {
      return;
    }

    return callSlack(message);
  });


  function _getBrand(brandName) {
    return { }
  }

  function _getBranch(branchName) {
    return { name: branchName };
  }

  function _getCustomer(userName) {
    return stores.customerStore.findByName(userName)
      .catch(error => null);
  }

  function _createCustomer(userName) {
    const Customer = require('../../scheduler/customer');
    const customer = new Customer({ name: userName });

    return stores.customerStore.create(customer)
      .then(customerId => stores.customerStore.find(customerId));
  }

  function _callSlack(channel) {
    return (message) => {
      slackBotClient.chat.postMessage({
        channel: channel,
        text: message,
      })
      .catch(error => console.log(error));
    }
  }

  function order(customer, product) {
    const useCase = new useCases.CustomerCreateCoffeeTurn({
      customerId: customer.id,
      customerCompany: 'TEST',
      customerElection: product,
      branchId: BRANCH_ID,
      turnStore: stores.turnStore,
      turnCacheStore: stores.turnCacheStore,
      customerStore: stores.customerStore,
      branchStore: stores.branchStore,
    });

    return useCase.execute()
      .then(turn => `Orden creada: ${turn.id}`)
      .catch(error => error.message);
  }

  function cancel(customer, turnId) {
    const useCase = new useCases.CustomerCancelCoffeeTurn({
      turnId,
      customerId: customer.id,
      branchId: BRANCH_ID,
      turnStore: stores.turnStore,
      turnCacheStore: stores.turnCacheStore,
      customerStore: stores.customerStore,
      branchStore: stores.branchStore,
    });

    return useCase.execute()
      .then(turn => `Orden cancelada: ${turn.id}`)
      .catch(error => error.message);
  }

  function detailBranch(customer, brand, branch) {
  }

  function listBranches(brand) {
  }

  function manageAPIError(res) {
    return (error) => { console.log(error); res.status(500).send(error.message);}
  }

  return app;
};

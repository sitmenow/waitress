const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const config = require('config');
const cors = require('cors');

const { UserModelNotFound } = require('../../lib/database/errors')


const secret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://sitmenow.auth0.com/.well-known/jwks.json',
});

const auth = jwt({
  secret,
  aud: 'https://coffee-shop.sitmenow.com',
  issuer: 'https://sitmenow.auth0.com/',
  algorithms: ['RS256'],
  scope: 'openid profile read:turns',
});

const user = (database) =>
  (req, res, next) => {
    database.users.find(req.user.sub)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) => {
        if (error instanceof UserModelNotFound) {
          res.status(404);
          res.json({ message: error.message });
        }
      })
      .catch((error) => {
        res.status(500);
        res.json({ message: error.message });
      });
  };

module.exports = {
  auth,
  user,
  cors: cors({ origin: config.api.origin }),
};

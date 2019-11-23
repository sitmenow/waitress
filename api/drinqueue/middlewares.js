const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const config = require('config');
const cors = require('cors');

const { UserModelNotFound } = require('../../lib/database/errors')
const { UserNotFound } = require('../../lib/errors')


const secret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://drinqueue.auth0.com/.well-known/jwks.json',
});

const auth = jwt({
  secret,
  aud: 'https://api.drinqueue.com',
  issuer: 'https://drinqueue.auth0.com/',
  algorithms: ['RS256'],
  scope: 'openid email profile',
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
          const userNotFoundError = new UserNotFound(req.user.sub);
          res.status(404);
          res.json({ message: userNotFoundError.message });
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

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const config = require('config');
const cors = require('cors');

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


module.exports = {
  auth,
  cors: cors({ origin: config.api.origin }),
};

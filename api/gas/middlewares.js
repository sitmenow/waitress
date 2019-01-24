const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const secret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://sitmenow.auth0.com/.well-known/jwks.json',
});

const auth = jwt({
  secret,
  audience: 'https://miturno.com.mx/api/v1/',
  issuer: 'https://sitmenow.auth0.com/',
  algorithms: ['RS256'],
});


module.exports = {
  auth,
};

module.exports = {
  api: {
    port: 3000,
  },
  services: {
    db: {
      driver: 'mongoose',
      scheme: 'mongodb',
      options: {
        useNewUrlParser: true,
      }
    },
    slack: {
      events: {
        secret: '',
      },
      web: {
        oauthToken: '',
        botToken: '',
      },
    },
  },
  hostessId: '',
  branchId: '',
  brandId: '',
};

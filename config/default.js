module.exports = {
  api: {
    port: 3000,
  },
  services: {
    db: {
      scheme: "mongodb",
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

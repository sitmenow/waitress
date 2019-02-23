module.exports = {
  api: {
    port: 3000,
  },
  services: {
    db: {
      scheme: "mongodb",
      useNewUrlParser: true,
      options: {
        useNewUrlParser: true,
      }
    },
  },
};

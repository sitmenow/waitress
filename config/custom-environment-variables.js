module.exports = {
  api: {
    port: 'PORT',
  },
  entities: {
    hostess: 'ENTITIES_HOSTESS',
  },
  services: {
    db: {
      scheme: "DB_SCHEME",
      host: "DB_HOST",
      port: "DB_PORT",
      user: "DB_USER",
      password: "DB_PASSWORD",
      database: "DB_DATABASE",
      options: {
        useNewUrlParser: 'DB_OPTIONS_USE_NEW_URL_PARSER',
      },
    },
  },
};

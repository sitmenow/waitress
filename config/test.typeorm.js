module.exports = {
  services: {
    db: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      // username: "grevych",
      password: "",
      database: "sit_me_now_test",
      schema: "public",
      entities: ["scheduler/services/db/typeorm/model/*.js"],
      // migrationsTableName: "migrations",
      // migrations: ["services/db/typeorm/migrations/*.ts"],
    }
  }
};

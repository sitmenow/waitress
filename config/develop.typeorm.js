module.exports = {
  services: {
    db: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      // username: "grevych",
      password: "",
      database: "sit_me_now_dev",
      schema: "public",
      entities: ["services/db/typeorm/model/*.js"],
      // migrationsTableName: "migrations",
      migrations: ["services/db/typeorm/migrations/*.ts"],
      cli: {
          migrationsDir: "services/db/typeorm/migrations"
      }
    }
  }
};

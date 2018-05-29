// Update with your config settings.
require("dotenv").config();

const db_configuration = {
  development: {
    client: "mysql2",
    connection: process.env.MYSQL_CONNECTION_STRING
      ? process.env.MYSQL_CONNECTION_STRING
      : "mysql://" +
        process.env.MYSQL_USER +
        ":" +
        process.env.MYSQL_PASSWORD +
        "@" +
        process.env.MYSQL_HOST +
        ":" +
        process.env.MYSQL_PORT +
        "/" +
        process.env.MYSQL_DB_NAME +
        "_dev?charset=utf8&timezone=UTC",
    seeds: {
      directory: "./seeds/dev"
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  test: {
    client: "mysql2",
    connection: process.env.MYSQL_CONNECTION_STRING
      ? process.env.MYSQL_CONNECTION_STRING
      : "mysql://" +
        process.env.MYSQL_USER +
        ":" +
        process.env.MYSQL_PASSWORD +
        "@" +
        process.env.MYSQL_HOST +
        ":" +
        process.env.MYSQL_PORT +
        "/" +
        process.env.MYSQL_DB_NAME +
        "_test?charset=utf8&timezone=UTC",
    seeds: {
      directory: "./seeds/test"
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: "mysql2",
    connection: process.env.MYSQL_CONNECTION_STRING
      ? process.env.MYSQL_CONNECTION_STRING
      : "mysql://" +
        process.env.MYSQL_USER +
        ":" +
        process.env.MYSQL_PASSWORD +
        "@" +
        process.env.MYSQL_HOST +
        ":" +
        process.env.MYSQL_PORT +
        "/" +
        process.env.MYSQL_DB_NAME +
        "?charset=utf8&timezone=UTC",
    seeds: {
      directory: "./seeds/production"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

module.exports = db_configuration;

import dotenv from "dotenv";
dotenv.config();
import Knex from "knex";

const testConnectionObject: Knex.MySqlConnectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME + "_test",
  dateStrings: true,
  charset: "utf8",
  timezone: "Europe/Helsinki"
};

const devConnectionObject: Knex.MySqlConnectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME + "_dev",
  dateStrings: true,
  charset: "utf8",
  timezone: "Europe/Helsinki"
};

const prodConnectionObject: Knex.MySqlConnectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  dateStrings: true,
  charset: "utf8",
  timezone: "Europe/Helsinki"
};

const development: Knex.Config = {
  client: "mysql2",
  version: "5.6",
  connection: devConnectionObject,
  seeds: {
    directory: "./seeds/dev"
  },
  pool: {
    min: 2,
    max: 10
  }
};

const test: Knex.Config = {
  client: "mysql2",
  version: "5.6",
  connection: testConnectionObject,
  seeds: {
    directory: "./seeds/test"
  },
  pool: {
    min: 2,
    max: 10
  }
};

const production: Knex.Config = {
  client: "mysql2",
  version: "5.6",
  connection: prodConnectionObject,
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
};

module.exports = {
  development,
  production,
  test
};

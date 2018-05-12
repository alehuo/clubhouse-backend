// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME + "_dev"
    },
    seeds: {
      directory: "./seeds/dev"
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function(conn, cb) {
        conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function(err) {
          cb(err, conn);
        });
      }
    }
  },

  test: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME + "_test"
    },
    seeds: {
      directory: "./seeds/test"
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function(conn, cb) {
        conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function(err) {
          cb(err, conn);
        });
      }
    }
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME
    },
    seeds: {
      directory: "./seeds/production"
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function(conn, cb) {
        conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function(err) {
          cb(err, conn);
        });
      }
    },
    migrations: {
      tableName: "knex_migrations"
    },
    afterCreate: function(conn, cb) {
      conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function(err) {
        cb(err, conn);
      });
    }
  }
};

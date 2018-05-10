// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.dev.sqlite3"
    },
    seeds: {
      directory: "./seeds/dev"
    },
    useNullAsDefault: true
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./database.test.sqlite3"
    },
    seeds: {
      directory: "./seeds/test"
    },
    useNullAsDefault: true
  },

  production: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "clubhouse",
      user: "postgres",
      password: ""
    },
    seeds: {
      directory: "./seeds/production"
    },
    pool: {
      afterCreate: function(connection, callback) {
        connection.query("SET TIME ZONE 'Europe/Helsinki';", function(err) {
          callback(err, connection);
        });
      },
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    useNullAsDefault: true
  }
};

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('dotenv').config();
module.exports = {

  development: {
    client: 'mssql',
    connection: {
      host: `${process.env.SQLSERVER_HOST}`,
      port: parseInt(process.env.SQLSERVER_PORT),
      user: `${process.env.SQLSERVER_USERNAME}`,
      password: `${process.env.SQLSERVER_PASSWORD}`,
      database: `${process.env.SQLSERVER_DATABASE}`,
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

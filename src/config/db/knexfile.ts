// Update with your config settings.
// require('dotenv').config()
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('ts-node/register');

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });


export default {
  development: {
    client: 'mysql2',
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "migrations",
    }
  },
  test: {
    client: 'mysql2',
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE_TEST
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "src/config/db/migrations",
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host : "",
      port : 3306,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "migrations",
    }
  }
};

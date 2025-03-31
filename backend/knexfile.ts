// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

import {
  DB_HOSTNAME,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
} from "./config/env";

const knexConfig = {
  client: "mysql2",
  connection: {
    host: DB_HOSTNAME,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
  },
  acquireConnectionTimeout: 843600000,
  pool: {
    min: 2,
    max: 20,
    acquireTimeoutMillis: 100000,
    idleTimeoutMillis: 100000,
  },
  migrations: {
    directory: "api/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "api/seeds",
  },
  onInsertTrigger: (table: any) => `
    CREATE TRIGGER ${table}_insert_uuid
    BEFORE INSERT ON ${table}
    FOR EACH ROW
    BEGIN
        SET NEW.id = UUID();
    END;
    `,
};

export default knexConfig;

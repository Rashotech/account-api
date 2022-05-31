import knex from "knex";
import configs from "..";
import Config from './knexfile';

const db = knex(Config[configs.env]);

export default db;
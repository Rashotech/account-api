import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tokens', (table: Knex.TableBuilder) => {
        table.increments("id").primary();
        table.integer('user_id').unsigned().notNullable();
        table.string("token").notNullable();
        table.string("type").notNullable();
        table.dateTime("expires").notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("tokens");
} 



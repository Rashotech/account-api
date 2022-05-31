import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('account', (table: Knex.TableBuilder) => {
        table.increments("id").primary();
        table.string("account_number", 10).notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.decimal('account_balance', 13, 2).defaultTo(0.00).notNullable();
        table.string("account_type").defaultTo("savings").notNullable();
        table.string("account_status").defaultTo("active").notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("account");
} 



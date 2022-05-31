import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table: Knex.TableBuilder) => {
        table.increments("id").primary();
        table.integer('account_id').unsigned().notNullable();
        table.string("transaction_type");
        table.decimal('transaction_amount', 13, 2).notNullable();
        table.string("transaction_description");
        table.string("transaction_status").defaultTo("pending").notNullable();
        table.foreign('account_id').references('id').inTable('account').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transactions");
}


import {Knex} from 'knex'; 

const TABLE_NAME = 'users';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, function(table) {
    table.uuid('id').primary().defaultTo(knex.raw(`gen_random_uuid()`));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}


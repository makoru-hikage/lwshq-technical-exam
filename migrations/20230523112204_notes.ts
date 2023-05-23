import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notes', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw(`gen_random_uuid()`));
    table.uuid('user_id').notNullable();
    table.string('title').notNullable();
    table.text('text');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('notes');
}

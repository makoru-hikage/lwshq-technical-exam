import { Knex } from 'knex';

const TABLE_NAME = 'todos';
const ENUM_NAME = 'priority_level';

const PRIORITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE ${ENUM_NAME} AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
  `);

  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.uuid('id').primary().defaultTo(knex.raw(`gen_random_uuid()`));
    table.uuid('user_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table
      .enum('priority', PRIORITY_LEVELS, {
        useNative: true,
        enumName: ENUM_NAME,
        existingType: true,
      })
      .defaultTo('MEDIUM');
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
  return knex.raw(`
    DROP TYPE IF EXISTS ${ENUM_NAME};
  `);
}

import dotenv from 'dotenv';
import Knex from 'knex';

dotenv.config();

export const testKnexConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'test_todo_local',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
};

export const knex = Knex(testKnexConfig);

export async function runMigrationAndSeeder(): Promise<void> {
  try {
    // Run migrations
    await knex.migrate.latest();

    // Run seeders
    await knex.seed.run({
      specific: '001_sample_user_and_note.ts',
    });

    console.log('Migration and seeding completed successfully!');
  } catch (error) {
    console.error('Error running migration and seeding:', error);
  }
}

import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Knex } from 'knex';
import knexPlugin from './lib/knex';

/**
 * This plugin enables database connection.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const dbConnectionPlugin: FastifyPluginAsync<{ 
  knexConfig: Knex.Config 
}> = fp(async (fastify, opts) => {

  await fastify.register(knexPlugin, {
    knexConfig: opts?.knexConfig ?? {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'todo_local',
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || ''
      }
    }
  });

  fastify.log.info('DATABASE PLUGIN LOADED');
}, {
  name: 'db-connection'
})

export default dbConnectionPlugin;

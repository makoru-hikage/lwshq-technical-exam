import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

import knexPlugin from './lib/knex'
import { Knex } from 'knex';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const dbConnectionPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(knexPlugin, {
    knexConfig: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '8000'),
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
      }
    }
  });

  fastify.log.info('DATABASE PLUGIN LOADED');
}, {
  name: 'db-connection'
})

export default dbConnectionPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex
  }
}

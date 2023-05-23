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
        host: fastify.env.DB_HOST,
        port: fastify.env.DB_PORT,
        database: fastify.env.DB_NAME,
        user: fastify.env.DB_USERNAME,
        password: fastify.env.DB_PASSWORD
      }
    }
  });

  fastify.log.info('DATABASE PLUGIN LOADED');
}, {
  name: 'db-connection',
  decorators: { fastify: ['env'] },
  dependencies: ['fastify-env']
})

export default dbConnectionPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    knex: Knex
  }
}

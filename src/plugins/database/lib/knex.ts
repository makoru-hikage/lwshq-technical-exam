import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import knex, { Knex } from 'knex';

interface KnexPluginOptions {
  knexConfig: Knex.Config;
}

const knexPlugin: FastifyPluginAsync<KnexPluginOptions> = fastifyPlugin(async (fastify, options) => {
  const knexInstance = knex(options.knexConfig);

  fastify.decorate('knex', knexInstance);

  fastify.addHook('onClose', async () => {
    await knexInstance.destroy();
  });
});

export default knexPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex
  }
}
import { FastifyPluginAsync } from 'fastify';
import knex, { Knex } from 'knex';

interface KnexPluginOptions {
  knexConfig: Knex.Config;
}

const knexPlugin: FastifyPluginAsync<KnexPluginOptions> = async (fastify, options) => {
  const knexInstance = knex(options.knexConfig);

  fastify.decorate('knex', knex);

  fastify.addHook('onClose', async () => {
    await knexInstance.destroy();
  });
};

export default knexPlugin;

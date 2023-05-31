import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const [a] = await fastify.knex.select(fastify.knex.raw(`NOW()`));
    return a;
  });
};

export default root;

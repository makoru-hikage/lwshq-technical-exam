import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/', async function (request, reply) {
    const [a] = await fastify.knex.raw(`SELECT NOW()`);
    return a;
  })
}

export default root;

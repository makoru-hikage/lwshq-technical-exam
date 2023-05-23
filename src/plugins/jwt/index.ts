import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify'


/**
 * This plugin enables the use of cookies.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'S3Cr3t!!',
  });

  fastify.log.info('COOKIE PLUGIN LOADED');
}, {
  name: 'cookie'
})

export default jwtPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyInstance {
    decode: any;
    sign: any;
    verify: any;
  }
}
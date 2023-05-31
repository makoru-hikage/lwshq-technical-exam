import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

export type UserPayload = {
  id: string;
  name: string;
  email: string;
};

/**
 * This plugin enables the use of cookies.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const jwtPlugin: FastifyPluginAsync = fp(
  async fastify => {
    await fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET || 'S3Cr3t!!',
      cookie: {
        cookieName: 'logged_user',
        signed: false, // Set to true if you are using something like PGP
      },
    });

    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.code(401).send({ message: 'Access denied' });
          throw new Error('Access denied');
        }
      },
    );

    fastify.log.info('JWT PLUGIN LOADED');
  },
  {
    name: 'jwt-plugin',
  },
);

export default jwtPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyInstance {
    decode: (jwt: string) => Promise<any>;
    sign: (input: string | object) => Promise<string>;
    verify: (jwt: string) => Promise<boolean>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: UserPayload;
  }
}

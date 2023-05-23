import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env'
import envSchema from './dotenv/env-schema'

export interface environmentVariables {
  env: {
    HOST: string;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  };
}

/**
 * This plugin is for loading env files
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const fastifyEnvPlugin = fp<environmentVariables>(async (fastify) => {
  await fastify.register(fastifyEnv, {
    confKey: 'env',
    schema: envSchema
  });

  fastify.log.info('DOTENV PLUGIN LOADED');
}, {
  name: 'fastify-env'
})

export default fastifyEnvPlugin;

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    env: {
      HOST: string;
      PORT: number;
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
    };
  }
}
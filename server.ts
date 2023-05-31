// Read the .env file.
import * as dotenv from 'dotenv';

dotenv.config();

// Require the framework
import Fastify from 'fastify';

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace';
import { FastifyServerOptions } from 'fastify';
import { Knex } from 'knex';
import { app } from './src/app';

async function server(
  opts: FastifyServerOptions & { knexConfig?: Knex.Config } = {},
) {
  // Instantiate Fastify with some config
  const fastify = Fastify({
    logger: true,
  });

  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace(
    { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') },
    async function ({ signal, err, manual }) {
      if (err) {
        fastify.log.error(err);
      }
      await fastify.close();
    } as closeWithGrace.CloseWithGraceAsyncCallback,
  );

  // Register your application as a normal plugin.
  fastify.register(app, opts);

  fastify.addHook('onClose', async (instance, done) => {
    closeListeners.uninstall();
    done();
  });

  return fastify;
}

export default server;

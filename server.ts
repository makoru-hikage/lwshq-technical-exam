// Read the .env file.
import * as dotenv from "dotenv";
import fastifyEnv from '@fastify/env';

import envSchema from "./src/env-schema";

dotenv.config();

// Require the framework
import Fastify from "fastify";

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from "close-with-grace";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import("./src/app"));

app.register(fastifyEnv, {
  confKey: 'env',
  schema: envSchema
})

// delay is the number of milliseconds for the graceful close to finish 
const closeListeners = closeWithGrace(
  { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') },
  async function ({ signal, err, manual }
) {
  if (err) {
    app.log.error(err)
  }
  await app.close()
} as closeWithGrace.CloseWithGraceAsyncCallback)

app.addHook('onClose', async (instance, done) => {
  closeListeners.uninstall()
  done()
})

// Start listening.
app.listen({ port: parseInt(process.env.PORT || '8000') }, (err: any) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

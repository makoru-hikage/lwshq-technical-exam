import app from './server';

(async () => {
  // Start listening.
  const server = await app();

  server.listen(
    { port: parseInt(process.env.PORT || '8000') },
    (err: unknown) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    },
  );
})();

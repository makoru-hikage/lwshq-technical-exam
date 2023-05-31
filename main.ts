import app from './server'

// Start listening.
app.listen({ port: parseInt(process.env.PORT || '8000') }, (err: any) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

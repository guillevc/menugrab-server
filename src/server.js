const start = async () => {
  const { buildApp } = require('./app');
  const app = await buildApp();
  try {
    await app.listen(app.env.PORT || 3000, '0.0.0.0');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

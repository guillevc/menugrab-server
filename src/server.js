import buildApp from './app';

const start = async () => {
  const app = await buildApp();
  try {
    await app.listen(app.env.PORT, '0.0.0.0');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

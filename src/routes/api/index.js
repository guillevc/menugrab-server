import userRoutes from './users';

console.log(userRoutes);

export default async (app, _options) => {
  // app.register((await import('./restaurants')).default, { prefix: 'restaurants' });
  // app.register((await import('./orders')).default, { prefix: 'orders' });
  app.register(userRoutes, { prefix: 'users' });
};

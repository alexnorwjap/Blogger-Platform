import express, { Express } from 'express';
import { getClearDbRouter } from './testing-routers/clearDB-router';
import { getPostsRoutes } from './features/posts/posts.router';
import { getBlogsRoutes } from './features/blogs/blogs.router';
import { usersRoutes } from './features/users/infrastructure/routes/usersRouter';
import { authRoutes } from './features/auth/infrastructure/routes/authRouter';

export const routerPaths = {
  users: '/users',
  blogs: '/blogs',
  posts: '/posts',
  auth: '/auth',
  clearDb: '/testing/all-data',
  root: '/',
};

export const setupApp = async (app: Express) => {
  app.use(express.json());
  app.use(routerPaths.clearDb, getClearDbRouter());
  app.use(routerPaths.blogs, getBlogsRoutes());
  app.use(routerPaths.posts, getPostsRoutes());
  app.use(routerPaths.users, usersRoutes());
  app.use(routerPaths.auth, authRoutes());
  app.get(routerPaths.root, (_req, res) => {
    res.send('IT Camasutra!!!');
  });

  return app;
};

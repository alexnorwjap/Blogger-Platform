import express, { Express } from 'express';
import { getClearDbRouter } from './testing-routers/clearDB-router';
import { getPostsRoutes } from './features/post/router/postRouter';
import { getBlogsRoutes } from './features/blog/router/blogRouter';
import { usersRoutes } from './features/users/infrastructure/routes/usersRouter';
import { authRoutes } from './features/auth/router/authRouter';
import { commentsRoutes } from './features/comments/router/commentsRouter';
import { deviceRoutes } from './features/device/router/deviceRouter';
import cookieParser from 'cookie-parser';

export const routerPaths = {
  devices: '/security/devices',
  users: '/users',
  blogs: '/blogs',
  posts: '/posts',
  comments: '/comments',
  auth: '/auth',
  clearDb: '/testing/all-data',
  root: '/',
};

export const setupApp = async (app: Express) => {
  app.set('trust proxy', true);
  app.use(express.json());
  app.use(cookieParser());
  app.use(routerPaths.clearDb, getClearDbRouter());
  app.use(routerPaths.blogs, getBlogsRoutes());
  app.use(routerPaths.posts, getPostsRoutes());
  app.use(routerPaths.users, usersRoutes());
  app.use(routerPaths.auth, authRoutes());
  app.use(routerPaths.comments, commentsRoutes());
  app.use(routerPaths.devices, deviceRoutes());
  app.get(routerPaths.root, (_req, res) => {
    res.send('IT Camasutra!!!');
  });

  return app;
};

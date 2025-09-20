import express, { Express } from 'express';
import { getClearDbRouter } from './testing-routers/clearDB-router';
import { getPostsRoutes } from './features/posts/posts.router';
import { getBlogsRoutes } from './features/blogs/blogs.router';

export const routerPaths = {
  blogs: '/blogs',
  posts: '/posts',
  clearDb: '/testing/all-data',
  root: '/',
};

export const setupApp = async (app: Express) => {
  app.use(express.json());
  app.use(routerPaths.clearDb, getClearDbRouter());
  app.use(routerPaths.blogs, getBlogsRoutes());
  app.use(routerPaths.posts, getPostsRoutes());
  app.get(routerPaths.root, (_req, res) => {
    res.send('IT Camasutra!!!');
  });

  return app;
};

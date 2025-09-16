import { Blog } from '../features/blogs/blogs.types';
import { Post } from '../features/posts/posts.types';

type DB = {
  blogs: Blog[];
  posts: Post[];
};

export { DB };

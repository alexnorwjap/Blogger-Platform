import db from '../../db/db';
import { Post } from './posts.types';
import { PostBodyInput } from './posts.dto';
import { blogsRepository } from '../blogs/blogs.repositories';

const postsRepository = {
  getAllPosts: (): Post[] => {
    return db.posts;
  },
  getPostById: (id: number): Post | null => {
    const result = db.posts.find((post: Post) => post.id === id);
    if (!result) {
      return null;
    }
    return result;
  },
  createPost: (post: PostBodyInput): Post => {
    const newPost = {
      id: Math.max(...db.posts.map(post => post.id), 0) + 1,
      ...post,
      blogId: Number(post.blogId),
      blogName: blogsRepository.getBlogNameById(Number(post.blogId)),
    };
    db.posts.push(newPost);
    return newPost;
  },
  updatePost: (id: number, post: PostBodyInput): boolean => {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return false;
    }
    db.posts[postIndex] = {
      ...db.posts[postIndex],
      ...post,
      blogId: Number(post.blogId),
      blogName: blogsRepository.getBlogNameById(Number(post.blogId)),
    };
    return true;
  },
  deletePost: (id: number): boolean => {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return false;
    }
    db.posts.splice(postIndex, 1);
    return true;
  },
};

export { postsRepository };

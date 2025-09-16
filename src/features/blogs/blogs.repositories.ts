import db from '../../db/db';
import { BlogBodyInput } from './blogs.dto';
import { Blog } from './blogs.types';

const blogsRepository = {
  getAllBlogs: (): Blog[] => {
    return db.blogs;
  },
  getBlogById: (id: number): Blog | null => {
    const result = db.blogs.find(blog => blog.id === id);
    if (!result) {
      return null;
    }
    return result;
  },
  createBlog: (blog: BlogBodyInput): Blog => {
    const newBlog = {
      id: Math.max(...db.blogs.map(blog => blog.id), 0) + 1,
      ...blog,
    };
    db.blogs.push(newBlog);
    return newBlog;
  },
  updateBlog: (id: number, blog: BlogBodyInput): boolean => {
    const blogIndex = db.blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) {
      return false;
    }
    db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...blog };
    return true;
  },
  deleteBlog: (id: number): boolean => {
    const blogIndex = db.blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) {
      return false;
    }
    db.blogs.splice(blogIndex, 1);
    return true;
  },

  getBlogNameById: (id: number): string => {
    const blog = db.blogs.find(blog => blog.id === id);
    if (!blog) {
      return '';
    }
    return blog.name;
  },
};

export { blogsRepository };

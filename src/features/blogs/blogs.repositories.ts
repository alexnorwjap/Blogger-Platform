import { blogCollection } from '../../db/mongo.db';
import { WithId } from 'mongodb';
import { ObjectId } from 'mongodb';

import { BlogBodyInput, BlogBodyOutput } from './blogs.dto';
import { Blog } from './blogs.types';

const blogsRepository = {
  getAllBlogs: async (): Promise<WithId<Blog>[]> => {
    return blogCollection.find().toArray();
  },
  getBlogById: async (id: string): Promise<WithId<Blog> | null> => {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  create: async (blog: Blog): Promise<WithId<Blog>> => {
    const result = await blogCollection.insertOne(blog);
    return { ...blog, _id: result.insertedId };
  },
  updateBlog: async (id: string, blog: BlogBodyInput): Promise<boolean> => {
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...blog } }
    );
    return result.modifiedCount > 0;
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

export { blogsRepository };

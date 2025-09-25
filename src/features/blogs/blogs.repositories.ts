import { blogCollection } from '../../db/mongo.db';
import { WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { BlogMongoQuery } from './blogs.types';

import { BlogBodyInput } from './blogs.dto';
import { Blog } from './blogs.types';

const blogsRepository = {
  getBlogsWithQuery: async (params: BlogMongoQuery): Promise<WithId<Blog>[]> => {
    return blogCollection
      .find(params.filter)
      .sort(params.sort)
      .skip(params.skip)
      .limit(params.limit)
      .toArray();
  },
  getBlogsCount: async (filter: object): Promise<number> => {
    return blogCollection.countDocuments(filter);
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

  getNameById: async (id: string): Promise<string> => {
    const result = await blogCollection.findOne({ _id: new ObjectId(id) });
    return result?.name || 'name not found';
  },
};

export { blogsRepository };

import { postCollection } from '../../db/mongo.db';
import { WithId } from 'mongodb';
import { ObjectId } from 'mongodb';

import { PostBodyInput } from './posts.dto';
import { Post } from './posts.types';
import { PostMongoQuery } from './posts.types';

const postsRepository = {
  getAllPosts: async (params: PostMongoQuery): Promise<WithId<Post>[]> => {
    return postCollection
      .find(params.filter)
      .sort(params.sort)
      .skip(params.skip)
      .limit(params.limit)
      .toArray();
  },
  getPostsCount: async (filter: object): Promise<number> => {
    return postCollection.countDocuments(filter);
  },
  getPostsByBlogId: async (blogId: string): Promise<WithId<Post>[]> => {
    return postCollection.find({ blogId }).toArray();
  },
  getPostById: async (id: string): Promise<WithId<Post> | null> => {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  createPost: async (post: Post): Promise<WithId<Post>> => {
    const newPost = await postCollection.insertOne(post);
    return { ...post, _id: newPost.insertedId };
  },
  updatePost: async (id: string, post: PostBodyInput): Promise<boolean> => {
    const result = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...post,
        },
      }
    );
    return result.modifiedCount > 0;
  },
  deletePost: async (id: string): Promise<boolean> => {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

export { postsRepository };

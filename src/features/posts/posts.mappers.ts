import { Post } from './posts.types';
import { PostBodyOutput } from './posts.dto';
import { WithId } from 'mongodb';

export const toPostDTO = (object: WithId<Post>): PostBodyOutput => {
  return {
    id: object._id.toString(),
    title: object.title,
    shortDescription: object.shortDescription,
    content: object.content,
    blogId: object.blogId,
    blogName: object.blogName,
    createdAt: object.createdAt,
  };
};

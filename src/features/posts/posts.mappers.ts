import { Post } from './posts.types';
import { PostBodyOutput } from './posts.dto';
import { WithId } from 'mongodb';

export const toPostDTO = (object: WithId<Post>): PostBodyOutput => {
  return {
    ...object,
    _id: object._id.toString(),
  };
};

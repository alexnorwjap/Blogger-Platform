import { Post } from './posts.types';
import { PostBodyOutput } from './posts.dto';

export const toPostDTO = (object: Post): PostBodyOutput => {
  return {
    ...object,
    id: String(object.id),
    blogId: String(object.blogId),
  };
};

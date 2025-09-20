import { postsRepository } from '../posts.repositories';
import { PostBodyInput, PostBodyOutput } from '../posts.dto';
import { toPostDTO } from '../posts.mappers';

export const createdPostService = async (
  post: PostBodyInput
): Promise<PostBodyOutput> => {
  const newPost = {
    ...post,
    blogId: post.blogId,
    blogName: post.blogId,
    createdAt: new Date(),
  };
  return toPostDTO(await postsRepository.createPost(newPost));
};

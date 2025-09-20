import { postsRepository } from '../posts.repositories';
import { PostBodyInput } from '../posts.dto';

const updatePostService = async (
  id: string,
  post: PostBodyInput
): Promise<Boolean> => {
  return await postsRepository.updatePost(id, post);
};

export { updatePostService };

import { postsRepository } from '../posts.repositories';
import { PostBodyInput, PostBodyOutput } from '../posts.dto';
import { toPostDTO } from '../posts.mappers';
import { blogsRepository } from '../../blogs/blogs.repositories';

export const createdPostService = async (
  post: PostBodyInput
): Promise<PostBodyOutput> => {
  const newPost = {
    ...post,
    blogName: await blogsRepository.getNameById(post.blogId),
    createdAt: new Date(),
  };
  return toPostDTO(await postsRepository.createPost(newPost));
};

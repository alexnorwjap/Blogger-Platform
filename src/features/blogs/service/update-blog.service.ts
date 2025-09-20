import { BlogBodyInput, BlogBodyOutput } from '../blogs.dto';
import { blogsRepository } from '../blogs.repositories';

const updateBlogService = async (
  id: string,
  blog: BlogBodyInput
): Promise<boolean> => {
  return await blogsRepository.updateBlog(id, blog);
};

export { updateBlogService };

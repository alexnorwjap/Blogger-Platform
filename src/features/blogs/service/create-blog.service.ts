import { BlogBodyInput, BlogBodyOutput } from '../blogs.dto';
import { blogsRepository } from '../blogs.repositories';
import { toBlogDTO } from '../blogs.mappers';

const createBlogService = async (blog: BlogBodyInput): Promise<BlogBodyOutput> => {
  const newBlog = {
    ...blog,
    createdAt: new Date(),
    isMembership: true,
  };
  return toBlogDTO(await blogsRepository.create(newBlog));
};

export { createBlogService };

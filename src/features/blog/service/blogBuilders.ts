import { InputBlogDto } from './blogServiceDto';
import { BlogCreateDto } from '../repositories/dto/blogDto';

function createBlog(inputDto: InputBlogDto): BlogCreateDto {
  return {
    name: inputDto.name,
    description: inputDto.description,
    websiteUrl: inputDto.websiteUrl,
    createdAt: new Date(),
    isMembership: false,
  };
}

export { createBlog };

import { CreatePostDto } from '../repositories/dto/postRepoDto';
import { InputPostDto, InputPostDtoByBlogId } from './serviceDto';

function createPost(inputDto: InputPostDto, blogName: string): CreatePostDto {
  return {
    title: inputDto.title,
    shortDescription: inputDto.shortDescription,
    content: inputDto.content,
    blogId: inputDto.blogId,
    blogName: blogName,
    createdAt: new Date(),
  };
}

function createPostByBlogId(inputDto: InputPostDtoByBlogId, blogName: string, blogId: string): CreatePostDto {
  return {
    title: inputDto.title,
    shortDescription: inputDto.shortDescription,
    content: inputDto.content,
    blogId: blogId,
    blogName: blogName,
    createdAt: new Date(),
  };
}

export { createPost, createPostByBlogId };

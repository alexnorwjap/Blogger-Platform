import { PostModel } from '../models/Post';
import { queryParamsDto } from './dto/queryRepoPostDto';
import { PostsViewModel } from '../models/PostsViewModel';

export interface PostQueryRepository {
  getAll(query: queryParamsDto): Promise<PostsViewModel>;
  getPostById(id: string): Promise<PostModel | null>;
  getAllPostsByBlogId(blogId: string, query: queryParamsDto): Promise<PostsViewModel>;
}

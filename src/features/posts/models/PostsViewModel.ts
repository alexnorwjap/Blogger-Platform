import { PostModel } from './Post';

export class PostsViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: PostModel[]
  ) {}
}

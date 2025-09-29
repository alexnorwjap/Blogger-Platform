import { BlogModel } from './Blog';

export class BlogsViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: BlogModel[]
  ) {}
}

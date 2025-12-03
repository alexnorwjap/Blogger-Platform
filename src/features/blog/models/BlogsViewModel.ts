class BlogViewModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly websiteUrl: string,
    readonly createdAt: string,
    readonly isMembership: boolean
  ) {}
}
class BlogsViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: BlogViewModel[]
  ) {}
}

export { BlogViewModel, BlogsViewModel };

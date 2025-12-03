class PostViewModel {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly shortDescription: string,
    readonly content: string,
    readonly blogId: string,
    readonly blogName: string,
    readonly createdAt: Date,
    readonly extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: {
        userId: string;
        login: string;
        addedAt: Date;
      }[];
    }
  ) {}
}

class PostsViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: PostViewModel[]
  ) {}
}

export { PostViewModel, PostsViewModel };

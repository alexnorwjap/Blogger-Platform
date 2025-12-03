export class CommentViewModel {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly commentatorInfo: { userId: string; userLogin: string },
    readonly createdAt: Date,
    readonly likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: String;
    }
  ) {}
}

export class CommentsViewModel {
  constructor(
    readonly pagesCount: number,
    readonly page: number,
    readonly pageSize: number,
    readonly totalCount: number,
    readonly items: CommentViewModel[]
  ) {}
}

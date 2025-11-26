class LikeModel {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly commentId: string,
    readonly status: string,
    readonly createdAt: Date
  ) {}
}

export { LikeModel };

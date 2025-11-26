type LikeFindDto = {
  userId: string;
  commentId: string;
};

type LikeChangeDto = {
  likeId: string;
  status: string;
};

type LikeCreateDto = {
  userId: string;
  commentId: string;
  postId: string;
  status: string;
};

export { LikeFindDto, LikeChangeDto, LikeCreateDto };

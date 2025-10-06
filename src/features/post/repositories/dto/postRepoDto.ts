type CreatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type UpdatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export { CreatePostDto, UpdatePostDto };

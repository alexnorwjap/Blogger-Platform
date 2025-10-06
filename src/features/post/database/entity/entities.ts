type PostEntity = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type InputForUpdatePost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export { InputForUpdatePost, PostEntity };

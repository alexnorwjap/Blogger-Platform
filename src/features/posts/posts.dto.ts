type PostId = {
  id: string;
};

type PostBodyOutput = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

type PostBodyInput = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

type PostsViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostBodyOutput[];
};

export { PostId, PostBodyOutput, PostBodyInput, PostsViewModel };

type PostQueryParam = {
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

export { PostQueryParam, PostBodyOutput, PostBodyInput };

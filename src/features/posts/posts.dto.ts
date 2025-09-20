type PostQueryParam = {
  id: string;
};

type PostBodyOutput = {
  _id: string;
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

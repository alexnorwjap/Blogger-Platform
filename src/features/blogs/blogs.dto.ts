type BlogId = {
  id: string;
};

type BlogBodyInput = {
  name: string;
  description: string;
  websiteUrl: string;
};

type PostInputForBlog = {
  title: string;
  shortDescription: string;
  content: string;
};

export { BlogId, BlogBodyInput, PostInputForBlog };

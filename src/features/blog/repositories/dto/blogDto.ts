type BlogCreateDto = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

type BlogUpdateDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

type BlogId = {
  id: string;
};

type PostInputForBlog = {
  title: string;
  shortDescription: string;
  content: string;
};

export { BlogCreateDto, BlogUpdateDto, BlogId, PostInputForBlog };

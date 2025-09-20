type BlogQueryParam = {
  id: string;
};

type BlogBodyOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

type BlogBodyInput = {
  name: string;
  description: string;
  websiteUrl: string;
};

export { BlogQueryParam, BlogBodyOutput, BlogBodyInput };

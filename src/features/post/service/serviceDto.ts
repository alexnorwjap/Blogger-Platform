type InputPostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

type InputPostDtoByBlogId = {
  title: string;
  shortDescription: string;
  content: string;
};

export { InputPostDto, InputPostDtoByBlogId };

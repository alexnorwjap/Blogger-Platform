type RepoRequestLogDto = {
  ip: string;
  url: string;
  date: Date;
};

type QueryRepoRequestLogDto = {
  ip: string;
  url: string;
};

export { RepoRequestLogDto, QueryRepoRequestLogDto };

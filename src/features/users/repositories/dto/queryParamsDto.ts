export type queryParamsDto = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: string;
  pageSize: string;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};

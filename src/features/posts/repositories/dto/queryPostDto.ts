export type queryParamsDto = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: string;
  pageSize: string;
};

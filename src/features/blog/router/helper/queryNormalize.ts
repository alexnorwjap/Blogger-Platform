type QueryParamsOutput = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: string;
  pageSize: string;
};

type QueryParamsInput = {
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

function queryBlogsNormalize(query: QueryParamsInput): QueryParamsOutput {
  const {
    searchNameTerm = null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = '1',
    pageSize = '10',
  } = query;
  return {
    searchNameTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };
}

export { queryBlogsNormalize, QueryParamsInput, QueryParamsOutput };

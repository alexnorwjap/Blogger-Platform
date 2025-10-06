type QueryParamsOutput = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: string;
  pageSize: string;
};

type QueryParamsInput = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

function queryPostNormalize(query: QueryParamsInput): QueryParamsOutput {
  const { sortBy = 'createdAt', sortDirection = 'desc', pageNumber = '1', pageSize = '10' } = query;
  return {
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };
}

export { queryPostNormalize, QueryParamsInput, QueryParamsOutput };

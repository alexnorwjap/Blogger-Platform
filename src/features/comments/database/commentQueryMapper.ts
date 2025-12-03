import { CommentDocument } from './commentsEntity';
import { CommentViewModel, CommentsViewModel } from '../model/commentViewModel';
import { queryParamsDto } from '../repository/repositoryDto';

export type FilterSortPagination = {
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};
export class CommentQueryMapper {
  public static toDomain(entity: CommentDocument, status: string | null = null): CommentViewModel {
    return {
      id: entity.id,
      content: entity.content,
      commentatorInfo: entity.commentatorInfo,
      createdAt: entity.createdAt,
      likesInfo: {
        likesCount: entity.likesInfo?.likesCount || 0,
        dislikesCount: entity.likesInfo?.dislikesCount || 0,
        myStatus: status ? status : 'None',
      },
    };
  }

  public static toDomainViewModel(
    query: queryParamsDto,
    count: number,
    comments: CommentViewModel[]
  ): CommentsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: comments,
    };
  }

  public static toFilterSortPagination(query: queryParamsDto): FilterSortPagination {
    return {
      sort: { [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 },
      skip: (+query.pageNumber - 1) * +query.pageSize,
      limit: +query.pageSize,
    };
  }
}

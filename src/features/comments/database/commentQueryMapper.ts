import { WithId } from 'mongodb';
import { CommentEntity } from './commentsEntity';
import { CommentViewModel, CommentsViewModel } from '../model/commentModel';
import { queryParamsDto } from '../repository/repositoryDto';
import { FilterSortPagination } from './commentsEntity';

export class CommentQueryMapper {
  public static toDomain(
    entity: WithId<CommentEntity>,
    status: string | null = null
  ): CommentViewModel {
    return {
      id: entity._id.toString(),
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

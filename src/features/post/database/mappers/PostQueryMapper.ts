import { PostViewModel, PostsViewModel } from '../../models/PostsViewModel';
import { PostDocument } from '../entity/postEntities';
import { queryParamsDto } from '../../repositories/dto/queryRepoPostDto';

type FilterSortPagination = {
  sort: { [key: string]: 1 | -1 };
  skip: number;
  limit: number;
};

export class PostQueryMapper {
  public static toDomain(
    entity: PostDocument,
    status: string | null,
    newestLikes: { userId: string; login: string; addedAt: Date }[] | []
  ): PostViewModel {
    return {
      id: entity.id,
      title: entity.title,
      shortDescription: entity.shortDescription,
      content: entity.content,
      blogId: entity.blogId,
      blogName: entity.blogName,
      createdAt: entity.createdAt,
      extendedLikesInfo: {
        likesCount: entity.extendedLikesInfo.likesCount,
        dislikesCount: entity.extendedLikesInfo.dislikesCount,
        myStatus: status || 'None',
        newestLikes: newestLikes,
      },
    };
  }

  public static toDomainViewModel(
    query: queryParamsDto,
    count: number,
    posts: PostViewModel[]
  ): PostsViewModel {
    return {
      pagesCount: Math.ceil(count / +query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: count,
      items: posts,
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

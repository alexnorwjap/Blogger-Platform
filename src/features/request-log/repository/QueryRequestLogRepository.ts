import { QueryRepoRequestLogDto } from './dto/RequestLogDto';

export interface QueryRequestLogRepository {
  countByFilter(dto: QueryRepoRequestLogDto): Promise<number>;
}

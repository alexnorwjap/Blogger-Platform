import { RequestDocument } from '../database/entities/requestEntities';
import { QueryRepoRequestLogDto } from './dto/RequestLogDto';

export interface RequestLogRepository {
  save(dto: RequestDocument): Promise<RequestDocument>;
  countByFilter(dto: QueryRepoRequestLogDto, tenSecondsAgo: Date): Promise<number>;
}

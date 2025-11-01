import { RepoRequestLogDto } from './dto/RequestLogDto';

export interface RequestLogRepository {
  addRequestLog(dto: RepoRequestLogDto): Promise<boolean>;
}

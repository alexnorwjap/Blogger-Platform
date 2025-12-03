import { QueryRepoRequestLogDto } from '../../repository/dto/RequestLogDto';
import { RequestLogRepository } from '../../repository/RequestLogRepository';
import { injectable } from 'inversify';
import { RequestDocument, RequestLogModel } from '../entities/requestEntities';

@injectable()
export class RequestLogRepositoryImpl implements RequestLogRepository {
  async save(dto: RequestDocument): Promise<RequestDocument> {
    return await dto.save();
  }
  async countByFilter(dto: QueryRepoRequestLogDto, tenSecondsAgo: Date): Promise<number> {
    return await RequestLogModel.countDocuments({
      ip: dto.ip,
      url: dto.url,
      date: { $gte: tenSecondsAgo },
    });
  }
}

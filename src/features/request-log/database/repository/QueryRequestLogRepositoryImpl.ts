import { QueryRequestLogRepository } from '../../repository/QueryRequestLogRepository';
import { QueryRepoRequestLogDto } from '../../repository/dto/RequestLogDto';
import { requestLogModel } from '../../../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class QueryRequestLogRepositoryImpl implements QueryRequestLogRepository {
  async countByFilter(dto: QueryRepoRequestLogDto): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const result = await requestLogModel.countDocuments({
      ip: dto.ip,
      url: dto.url,
      date: { $gte: tenSecondsAgo },
    });
    return result;
  }
}

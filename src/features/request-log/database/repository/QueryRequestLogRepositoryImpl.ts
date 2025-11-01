import { QueryRequestLogRepository } from '../../repository/QueryRequestLogRepository';
import { requestLogCollection } from '../../../../db/mongo.db';
import { QueryRepoRequestLogDto } from '../../repository/dto/RequestLogDto';

class QueryRequestLogRepositoryImpl implements QueryRequestLogRepository {
  async countByFilter(dto: QueryRepoRequestLogDto): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const result = await requestLogCollection.countDocuments({
      ip: dto.ip,
      url: dto.url,
      date: { $gte: tenSecondsAgo },
    });
    return result;
  }
}

export const queryRequestLogRepository = new QueryRequestLogRepositoryImpl();

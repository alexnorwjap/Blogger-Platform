import { RepoRequestLogDto } from '../../repository/dto/RequestLogDto';
import { RequestLogRepository } from '../../repository/RequestLogRepository';
import { requestLogModel } from '../../../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class RequestLogRepositoryImpl implements RequestLogRepository {
  async addRequestLog(dto: RepoRequestLogDto): Promise<boolean> {
    const result = await requestLogModel.create(dto);
    return result._id ? true : false;
  }
}

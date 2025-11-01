import { RepoRequestLogDto } from '../../repository/dto/RequestLogDto';
import { RequestLogRepository } from '../../repository/RequestLogRepository';
import { requestLogCollection } from '../../../../db/mongo.db';
import { ObjectId } from 'mongodb';

export class RequestLogRepositoryImpl implements RequestLogRepository {
  async addRequestLog(dto: RepoRequestLogDto): Promise<boolean> {
    const result = await requestLogCollection.insertOne({
      _id: new ObjectId(),
      ...dto,
    });
    return result.acknowledged;
  }
}

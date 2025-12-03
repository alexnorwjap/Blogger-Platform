import { Result } from '../../../shared/utils/result-object';
import { createResult } from '../../../shared/utils/result-object';
import { RequestLogRepositoryImpl } from '../database/repository/RequestLogRepositoryImpl';
import { inject, injectable } from 'inversify';
import { QueryRepoRequestLogDto } from '../repository/dto/RequestLogDto';
import { RequestLogModel } from '../database/entities/requestEntities';

export type InputAddRequestLogDto = {
  ip: string;
  url: string;
};

@injectable()
export class RequestLogService {
  constructor(
    @inject(RequestLogRepositoryImpl) readonly requestLogRepository: RequestLogRepositoryImpl
  ) {}

  async addRequestLog(dto: InputAddRequestLogDto): Promise<Result<boolean>> {
    const newRequest = RequestLogModel.createRequest(dto);
    await this.requestLogRepository.save(newRequest);

    return createResult('CREATED', true);
  }

  async countByFilter(dto: QueryRepoRequestLogDto): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10000);

    return await this.requestLogRepository.countByFilter(dto, tenSecondsAgo);
  }
}

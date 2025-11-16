import { Result } from '../../../shared/utils/result-object';
import { createResult } from '../../../shared/utils/result-object';
import { RequestLogRepositoryImpl } from '../database/repository/RequestLogRepositoryImpl';
import { inject, injectable } from 'inversify';

type InputAddRequestLogDto = {
  ip: string;
  url: string;
};

@injectable()
export class RequestLogService {
  constructor(
    @inject(RequestLogRepositoryImpl) readonly requestLogRepository: RequestLogRepositoryImpl
  ) {}

  async addRequestLog(dto: InputAddRequestLogDto): Promise<Result<boolean>> {
    const newRequestLog = {
      ip: dto.ip,
      url: dto.url,
      date: new Date(),
    };
    const resultRequesLogCreate = await this.requestLogRepository.addRequestLog(newRequestLog);
    if (!resultRequesLogCreate) return createResult('BAD_REQUEST', resultRequesLogCreate);

    return createResult('CREATED', resultRequesLogCreate);
  }
}

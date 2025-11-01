import { Result } from '../../../shared/utils/result-object';
import { RequestLogRepository } from '../repository/RequestLogRepository';
import { createResult } from '../../../shared/utils/result-object';
import { RequestLogRepositoryImpl } from '../database/repository/RequestLogRepositoryImpl';

type InputAddRequestLogDto = {
  ip: string;
  url: string;
};

class RequestLogService {
  constructor(readonly requestLogRepository: RequestLogRepository) {}

  async addRequestLog(dto: InputAddRequestLogDto): Promise<Result<boolean>> {
    const newRequestLog = {
      ip: dto.ip,
      url: dto.url,
      date: new Date(),
    };
    const resultRequesLogCreate = await this.requestLogRepository.addRequestLog(newRequestLog);
    if (!resultRequesLogCreate) {
      return createResult('BAD_REQUEST', resultRequesLogCreate, 'Request log not added');
    } else {
      return createResult('CREATED', resultRequesLogCreate);
    }
  }
}

export const requestLogService = new RequestLogService(new RequestLogRepositoryImpl());

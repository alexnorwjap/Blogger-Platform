import { NextFunction, Request, Response } from 'express';
import { RequestLogService } from '../../features/request-log/service/RequestLogService';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { QueryRequestLogRepositoryImpl } from '../../features/request-log/database/repository/QueryRequestLogRepositoryImpl';
import container from '../../ioc';

const queryRequestLogRepository = container.get<QueryRequestLogRepositoryImpl>(
  QueryRequestLogRepositoryImpl
);
const requestLogService = container.get<RequestLogService>(RequestLogService);

export const requestLogValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, originalUrl: url } = req;
  if (!ip || !url) {
    return next();
  }

  const resultCountRequestLog = await queryRequestLogRepository.countByFilter({ ip, url });
  if (resultCountRequestLog >= 5) return res.sendStatus(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);

  await requestLogService.addRequestLog({ ip, url });
  return next();
};

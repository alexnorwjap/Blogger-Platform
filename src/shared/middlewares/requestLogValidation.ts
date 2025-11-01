import { NextFunction, Request, Response } from 'express';
import { requestLogService } from '../../features/request-log/service/RequestLogService';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { queryRequestLogRepository } from '../../features/request-log/database/repository/QueryRequestLogRepositoryImpl';

export const requestLogValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, originalUrl: url } = req;
  if (!ip || !url) {
    console.log('send info to some service: ip or url is not found');
    return next();
  }

  const resultCountRequestLog = await queryRequestLogRepository.countByFilter({ ip, url });
  if (resultCountRequestLog > 5) {
    return res.sendStatus(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
  }
  await requestLogService.addRequestLog({ ip, url });
  return next();
};

import { NextFunction } from 'express';
import { validationResult, ValidationError, FieldValidationError } from 'express-validator';
import { Response, Request } from 'express';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { ValidationErrorType } from '../types/errors-type';

const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as FieldValidationError;
  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const resultIdValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });
  if (errors.length > 0) {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).send({ errorsMessages: errors });
  }

  next();
};

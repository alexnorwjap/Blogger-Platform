import { param } from 'express-validator';

export const deviceIdValidation = param('deviceId')
  .trim()
  .exists()
  .withMessage('Device ID is required')
  .isString()
  .withMessage('Device ID must be a string')
  .isMongoId()
  .withMessage('Incorrect format of Device ID');

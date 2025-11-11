import { body } from 'express-validator';

export const passwordValidation = body('newPassword')
  .exists()
  .withMessage('newPassword is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters');

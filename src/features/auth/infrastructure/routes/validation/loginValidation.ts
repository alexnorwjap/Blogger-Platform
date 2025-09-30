import { body } from 'express-validator';

const loginOrEmail = body('loginOrEmail')
  .exists()
  .withMessage('loginOrEmail is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct');

const password = body('password')
  .exists()
  .withMessage('password is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct');

export const loginValidation = [loginOrEmail, password];

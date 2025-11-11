import { body } from 'express-validator';

const login = body('login')
  .exists()
  .withMessage('login is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct')
  .isLength({ min: 3, max: 10 })
  .withMessage('Login must be between 3 and 10 characters')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('must contain only letters, numbers, underscores and hyphens');

const passwordValidation = body('password')
  .exists()
  .withMessage('password is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters');

export const emailValidation = body('email')
  .exists()
  .withMessage('email is required')
  .trim()
  .notEmpty()
  .withMessage('email is empty')
  .isEmail()
  .withMessage('must be a valid email address');

export const registrationValidation = [login, passwordValidation, emailValidation];

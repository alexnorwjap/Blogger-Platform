import { body } from 'express-validator';

const login = body('login')
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 })
  .withMessage('Login must be between 3 and 10 characters')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('must be unique');

const email = body('email')
  .exists()
  .withMessage('email is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct')
  .isEmail()
  .withMessage('must be a valid email address');

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password обязателен')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters');

export const usersValidation = [login, email, password];

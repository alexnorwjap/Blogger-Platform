import { body } from 'express-validator';

const login = body('login')
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 })
  .withMessage('Login must be between 3 and 10 characters')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('must be unique');

const email = body('email')
  .trim()
  .notEmpty()
  .custom(value => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(value)) {
      throw new Error('must be unique');
    }
    return true;
  });

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password обязателен')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters');

export const usersValidation = [login, email, password];

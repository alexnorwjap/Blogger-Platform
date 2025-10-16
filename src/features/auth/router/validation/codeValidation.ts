import { body } from 'express-validator';

const code = body('code').exists().withMessage('code is required').trim().notEmpty().withMessage('does not exist');

export const codeValidation = [code];

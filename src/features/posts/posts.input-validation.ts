import { body } from 'express-validator';

const titleValidation = body('title')
  .trim()
  .notEmpty()
  .withMessage('title is empty or not found')
  .isString()
  .withMessage('title should be string')
  .isLength({ max: 30, min: 1 })
  .withMessage('maxLength: 30, minLength: 1');

const descriptionValidation = body('shortDescription')
  .trim()
  .notEmpty()
  .withMessage('shortDescription is empty or not found')
  .isString()
  .withMessage('shortDescription should be string')
  .isLength({ max: 100, min: 1 })
  .withMessage('maxLength: 100, minLength: 1');

const contentValidation = body('content')
  .trim()
  .notEmpty()
  .withMessage('content is empty or not found')
  .isString()
  .withMessage('content should be string')
  .isLength({ max: 1000, min: 1 })
  .withMessage('maxLength: 1000, minLength: 1');

const blogIdValidation = body('blogId')
  .trim()
  .notEmpty()
  .withMessage('blogId is empty or not found')
  .isString()
  .withMessage('blogId should be string')
  .isLength({ max: 30, min: 1 })
  .withMessage('maxLength: 30, minLength: 1');

export const postInputDtoValidation = [
  titleValidation,
  descriptionValidation,
  contentValidation,
  blogIdValidation,
];

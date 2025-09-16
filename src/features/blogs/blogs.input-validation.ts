import { body } from 'express-validator';

const nameValidation = body('name')
  .trim()
  .notEmpty()
  .isString()
  .withMessage('name should be string')
  .isLength({ max: 15 })
  .withMessage('maxLength: 15, minLength: 1');

const descriptionValidation = body('description')
  .trim()
  .notEmpty()
  .isString()
  .withMessage('description should be string')
  .isLength({ max: 500, min: 1 })
  .withMessage('maxLength: 500, minLength: 1');

const websiteUrlValidation = body('websiteUrl')
  .trim()
  .notEmpty()
  .isString()
  .withMessage('websiteUrl should be string')
  .isLength({ max: 100, min: 1 })
  .withMessage('maxLength: 100, minLength: 1')
  .custom(value => {
    const regex =
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    if (!regex.test(value)) {
      throw new Error('websiteUrl should be a valid HTTPS URL');
    }
    return true;
  });

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

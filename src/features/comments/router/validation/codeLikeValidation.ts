import { body } from 'express-validator';

const likeStatusValidation = body('likeStatus')
  .exists()
  .withMessage('likeStatus is required')
  .trim()
  .notEmpty()
  .withMessage('must be correct')
  .isIn(['Like', 'Dislike', 'None'])
  .withMessage('must be Like or Dislike or None');

export const codeLikeValidation = [likeStatusValidation];

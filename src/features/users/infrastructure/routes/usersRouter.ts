import express from 'express';
import { authorization } from '../../../../shared/middlewares/authorization';
import { usersValidation } from '../routes/validation/postValidation';
import { inputValidationResult } from '../../../../shared/middlewares/result-validation';
import { idValidation } from '../../../../shared/middlewares/id-validation';
import { userController } from './userController';
import { resultIdValidation } from '../../../../shared/middlewares/resultIdValidation';

export const usersRoutes = () => {
  const router = express.Router();

  router.get('/', authorization, userController.getUsersList);

  router.post(
    '/',
    authorization,
    usersValidation,
    inputValidationResult,
    userController.createUser
  );

  router.delete('/:id', authorization, idValidation, resultIdValidation, userController.deleteUser);

  return router;
};

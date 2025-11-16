import express from 'express';
import { authorization } from '../../../../shared/middlewares/authorization';
import { usersValidation } from '../routes/validation/postValidation';
import { inputValidationResult } from '../../../../shared/middlewares/result-validation';
import { idValidation } from '../../../../shared/middlewares/id-validation';
import { resultIdValidation } from '../../../../shared/middlewares/resultIdValidation';
import container from '../../../../ioc';
import { UsersController } from './userController';

const usersController = container.get<UsersController>(UsersController);

export const usersRoutes = () => {
  const router = express.Router();

  router.get('/', authorization, usersController.getUsersList);

  router.post(
    '/',
    authorization,
    usersValidation,
    inputValidationResult,
    usersController.createUser
  );

  router.delete(
    '/:id',
    authorization,
    idValidation,
    resultIdValidation,
    usersController.deleteUser
  );

  return router;
};

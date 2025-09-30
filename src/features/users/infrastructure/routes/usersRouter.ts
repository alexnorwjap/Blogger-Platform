import express from 'express';
import { getUsersList } from '../routes/handlers/getUsersListHandler';
import { authorization } from '../../../../shared/middlewares/authorization';
import { createUser } from '../routes/handlers/createUserHandler';
import { deleteUser } from '../routes/handlers/deleteUserHandler';
import { usersValidation } from '../routes/validation/postValidation';
import { inputValidationResult } from '../../../../shared/middlewares/result-validation';

export const usersRoutes = () => {
  const router = express.Router();

  router.get('/', authorization, getUsersList);

  router.post('/', authorization, usersValidation, inputValidationResult, createUser);

  router.delete('/:id', authorization, deleteUser);

  return router;
};

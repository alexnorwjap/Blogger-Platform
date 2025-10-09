import express from 'express';
import { authController } from './authController';
import { authValidation } from './validation/authValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';

export const authRoutes = () => {
  const router = express.Router();

  router.post('/login', authValidation, inputValidationResult, authController.login);
  router.get('/me', authorizationBearer, authController.profile);

  return router;
};

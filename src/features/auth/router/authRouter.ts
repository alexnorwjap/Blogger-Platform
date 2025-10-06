import express from 'express';
import { authController } from './authController';
import { authValidation } from './validation/authValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';

export const authRoutes = () => {
  const router = express.Router();

  router.post('/login', authValidation, inputValidationResult, authController.login);

  return router;
};

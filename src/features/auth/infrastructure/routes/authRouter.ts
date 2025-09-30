import express from 'express';
import { loginUser } from '../routes/handlers/loginUserHandler';
import { loginValidation } from '../routes/validation/loginValidation';
import { inputValidationResult } from '../../../../shared/middlewares/result-validation';

export const authRoutes = () => {
  const router = express.Router();

  router.post('/login', loginValidation, inputValidationResult, loginUser);

  return router;
};

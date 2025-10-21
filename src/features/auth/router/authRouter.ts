import express from 'express';
import { authController } from './authController';
import { authValidation } from './validation/loginValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { emailValidation, registrationValidation } from './validation/registrationValidation';
import { codeValidation } from './validation/codeValidation';

export const authRoutes = () => {
  const router = express.Router();

  router.post('/login', authValidation, inputValidationResult, authController.login);

  router.get('/me', authorizationBearer, authController.profile);
  router.post('/registration', registrationValidation, inputValidationResult, authController.registration);
  router.post(
    '/registration-confirmation',
    codeValidation,
    inputValidationResult,
    authController.registrationConfirmation
  );
  router.post(
    '/registration-email-resending',
    emailValidation,
    inputValidationResult,
    authController.registrationEmailResending
  );

  router.post('/logout', authController.logout);
  router.post('/refresh-token', authController.refreshToken);

  return router;
};

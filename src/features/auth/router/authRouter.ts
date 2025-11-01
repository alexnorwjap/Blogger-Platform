import express from 'express';
import { authController } from './authController';
import { authValidation } from './validation/loginValidation';
import { inputValidationResult } from '../../../shared/middlewares/result-validation';
import { authorizationBearer } from '../../../shared/middlewares/authorizationBearer';
import { emailValidation, registrationValidation } from './validation/registrationValidation';
import { codeValidation } from './validation/codeValidation';
import { requestLogValidation } from '../../../shared/middlewares/requestLogValidation';
import { refreshTokenGuard } from '../../../shared/middlewares/refreshTokenGuard';

export const authRoutes = () => {
  const router = express.Router();

  router.post(
    '/login',
    requestLogValidation,
    authValidation,
    inputValidationResult,
    authController.login
  );

  router.get('/me', authorizationBearer, authController.profile);
  router.post(
    '/registration',
    requestLogValidation,
    registrationValidation,
    inputValidationResult,
    authController.registration
  );
  router.post(
    '/registration-confirmation',
    requestLogValidation,
    codeValidation,
    inputValidationResult,
    authController.registrationConfirmation
  );
  router.post(
    '/registration-email-resending',
    requestLogValidation,
    emailValidation,
    inputValidationResult,
    authController.registrationEmailResending
  );

  router.post('/logout', refreshTokenGuard, authController.logout);
  router.post('/refresh-token', refreshTokenGuard, authController.refreshToken);

  return router;
};

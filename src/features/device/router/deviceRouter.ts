import express from 'express';
import { deviceController } from './deviceController';
import { refreshTokenGuard } from '../../../shared/middlewares/refreshTokenGuard';
import { idValidation } from '../../../shared/middlewares/id-validation';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';

export const deviceRoutes = () => {
  const router = express.Router();

  router.get('/', refreshTokenGuard, deviceController.getDevices);
  router.delete('/', refreshTokenGuard, deviceController.deletedAllDevices);
  router.delete(
    '/:deviceId',
    refreshTokenGuard,
    idValidation,
    resultIdValidation,
    deviceController.deleteDevice
  );
  return router;
};

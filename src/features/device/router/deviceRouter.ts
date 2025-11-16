import express from 'express';
import { DeviceController } from './deviceController';
import { refreshTokenGuard } from '../../../shared/middlewares/refreshTokenGuard';
import { resultIdValidation } from '../../../shared/middlewares/resultIdValidation';
import { deviceIdValidation } from '../../../shared/middlewares/deviceIdValidation';
import container from '../../../ioc';

const deviceController = container.get<DeviceController>(DeviceController);

export const deviceRoutes = () => {
  const router = express.Router();

  router.get('/', refreshTokenGuard, deviceController.getDevices);
  router.delete('/', refreshTokenGuard, deviceController.deletedAllOtherDevices);
  router.delete(
    '/:deviceId',
    refreshTokenGuard,
    deviceIdValidation,
    resultIdValidation,
    deviceController.deleteDevice
  );
  return router;
};

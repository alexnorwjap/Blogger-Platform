import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';
import { jwtService } from '../infrastructure/jwtService';
import { UserRequest, RequestBody, DeviceRequest } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';
import { emailAdapter } from '../adapter/emailAdapter';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';

class AuthController {
  async login(req: RequestBody<AuthDto>, res: Response) {
    const user = await authQueryRepository.findByLoginOrEmail(req.body);
    if (!user) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const correctCredentials = await authService.correctCredentials(req.body, user);

    if (correctCredentials) {
      const device = await authService.createDevice(correctCredentials);
      if (!device) {
        res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
        return;
      }
      const accessToken = jwtService.generateToken(device.deviceId);
      const refreshToken = jwtService.generateRefreshToken(device);
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 60000 });
      res.status(HTTP_STATUS_CODES.OK_200).send({
        accessToken: accessToken,
      });
    } else {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
    }
  }

  async profile(req: DeviceRequest, res: Response) {
    if (!req.deviceId) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const user = await authQueryRepository.getProfile(req.deviceId);
    res.status(HTTP_STATUS_CODES.OK_200).send(user);
  }

  async registration(req: RequestBody<InputRegistrationDto>, res: Response) {
    const existingUser = await authQueryRepository.findByLoginOrEmail(req.body);

    if (existingUser) {
      const foundBy = existingUser.login === req.body.login ? 'login' : 'email';
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: `User with this ${foundBy} already exists`,
            field: foundBy,
          },
        ],
      });
      return;
    }
    const confirmationCode = await authService.registration(req.body);
    await emailAdapter.sendEmail(req.body.email, confirmationCode);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async registrationConfirmation(req: RequestBody<{ code: string }>, res: Response) {
    const user = await authQueryRepository.findByConfirmationCode(req.body.code);
    if (!user || user.isConfirmed) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: 'Invalid confirmation code or user already confirmed',
            field: 'code',
          },
        ],
      });
      return;
    }
    const result = await authService.registrationConfirmation(user);
    if (result) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: 'Confirmation code expired',
            field: 'code',
          },
        ],
      });
    }
  }

  async registrationEmailResending(req: RequestBody<{ email: string }>, res: Response) {
    const user = await authQueryRepository.findByEmail(req.body.email);
    if (!user) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: 'User with this email not found or already confirmed',
            field: 'email',
          },
        ],
      });
      return;
    }
    if (user.isConfirmed) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: 'User with this email already confirmed',
            field: 'email',
          },
        ],
      });
      return;
    }

    const newConfirmationCode = await authService.registrationEmailResending(user);
    await emailAdapter.sendEmail(user.email, newConfirmationCode);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async refreshToken(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken;
    if (!currentRefreshToken) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const device = jwtService.getDeviceIdByToken(currentRefreshToken);
    if (!device || new Date(device.expirationDate).getTime() < Date.now()) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const user = await authQueryRepository.findByDeviceId(device.deviceId);
    if (!user) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const storedDevice = user.devices?.find(d => d.deviceId === device.deviceId);
    if (storedDevice?.date.toISOString() !== device.date) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }

    const newPayLoad = await authService.updateDevice(user.userId, device);
    if (!newPayLoad) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const accessToken = jwtService.generateToken(newPayLoad.deviceId);
    const newRefreshToken = jwtService.generateRefreshToken(newPayLoad);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, maxAge: 60000 });
    res.status(HTTP_STATUS_CODES.OK_200).send({
      accessToken: accessToken,
    });
  }

  async logout(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken;
    if (!currentRefreshToken) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const device = jwtService.getDeviceIdByToken(currentRefreshToken);
    if (!device) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const user = await authQueryRepository.findByDeviceId(device.deviceId);
    if (!user) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
      return;
    }
    const result = await authService.deleteDevice(device.deviceId);
    if (result) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
      return;
    }
  }
}

export const authController = new AuthController();

import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';
import { UserRequest, RequestBody, RefreshTokenRequest } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';
import { emailAdapter } from '../adapter/emailAdapter';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';
import { deviceQueryRepository } from '../../device/repository/deviceQueryRepository';

class AuthController {
  // updated
  async login(req: RequestBody<AuthDto>, res: Response) {
    console.log(req.body, 'req.body');
    const loginResult = await authService.login(req.body, {
      ip: req.ip || 'Unknown ip',
      title: req.headers['user-agent'] || 'Unknown agent',
    });

    if (!loginResult.data) return res.sendStatus(HTTP_STATUS_CODES[loginResult.status]);

    res.cookie('refreshToken', loginResult.data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60000,
    });
    res
      .status(HTTP_STATUS_CODES[loginResult.status])
      .send({ accessToken: loginResult.data.accessToken });
  }

  async profile(req: UserRequest, res: Response) {
    if (!req.user) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    const user = await authQueryRepository.getProfile(req.user);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(user);
  }

  // вынести в сервис проверку на существование пользователя и вывод ошибки?
  async registration(req: RequestBody<InputRegistrationDto>, res: Response) {
    const existingUser = await authQueryRepository.findByLoginOrEmail(req.body);
    if (existingUser)
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
        errorsMessages: [
          {
            message: `User with this ${existingUser.login === req.body.login ? 'login' : 'email'} already exists`,
            field: existingUser.login === req.body.login ? 'login' : 'email',
          },
        ],
      });

    const result = await authService.registration(req.body, existingUser);
    if (result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);
  }

  // вынести в сервис проверку на существование кода и вывод ошибки?
  async registrationConfirmation(req: RequestBody<{ code: string }>, res: Response) {
    const user = await authQueryRepository.findByConfirmationCode(req.body.code);

    const result = await authService.registrationConfirmation(user!);
    if (result.data) {
      res.sendStatus(HTTP_STATUS_CODES[result.status]);
      return;
    }
    if (result.errorMessage) {
      res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
      return;
    }
  }

  // вынести в сервис проверку на существование пользователя и вывод ошибки?
  async registrationEmailResending(req: RequestBody<{ email: string }>, res: Response) {
    const user = await authQueryRepository.findByEmail(req.body.email);

    const newConfirmationCode = await authService.registrationEmailResending(user!);
    if (newConfirmationCode.errorMessage) {
      res.status(HTTP_STATUS_CODES[newConfirmationCode.status]).send({
        [newConfirmationCode.errorMessage]: newConfirmationCode.extensions,
      });
      return;
    }
    if (newConfirmationCode.data) {
      emailAdapter.sendEmail(user!.email, newConfirmationCode.data).catch(error => {
        console.log('error', error);
      });
      res.sendStatus(HTTP_STATUS_CODES[newConfirmationCode.status]);
      return;
    }
  }

  // оператор ! - плохо?   // updated
  async refreshToken(req: RefreshTokenRequest, res: Response) {
    const device = await deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!device) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }

    const newTokens = await authService.refreshToken(device, req.deviceId!);
    if (!newTokens.data) {
      res.sendStatus(HTTP_STATUS_CODES[newTokens.status]);
      return;
    }
    const { accessToken, refreshToken } = newTokens.data;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60000,
    });
    res.status(HTTP_STATUS_CODES[newTokens.status]).send({ accessToken: accessToken });
  }

  // updated
  async logout(req: RefreshTokenRequest, res: Response) {
    const resultLogout = await authService.logout(req.deviceId!);
    if (!resultLogout.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
    }
    return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
  }
}

export const authController = new AuthController();

import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Response } from 'express';
import { UserRequest, RequestBody, RefreshTokenRequest } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';
import { deviceQueryRepository } from '../../device/repository/deviceQueryRepository';

class AuthController {
  async login(req: RequestBody<AuthDto>, res: Response) {
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

  async registration(req: RequestBody<InputRegistrationDto>, res: Response) {
    const result = await authService.registration(req.body);
    if (!result.data && result.errorMessage)
      return res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  }

  async registrationConfirmation(req: RequestBody<{ code: string }>, res: Response) {
    const user = await authQueryRepository.findByConfirmationCode(req.body.code);

    const result = await authService.registrationConfirmation(user);
    if (!result.data && result.errorMessage)
      return res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  }
  //  стоит ли вынести в сервис проверку на существование пользователя и вывод ошибки?
  async registrationEmailResending(req: RequestBody<{ email: string }>, res: Response) {
    const user = await authQueryRepository.findByEmail(req.body.email);
    if (!user) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);

    const newConfirmationCode = await authService.registrationEmailResending(user);
    if (newConfirmationCode.errorMessage) {
      return res.status(HTTP_STATUS_CODES[newConfirmationCode.status]).send({
        [newConfirmationCode.errorMessage]: newConfirmationCode.extensions,
      });
    }
    res.sendStatus(HTTP_STATUS_CODES[newConfirmationCode.status]);
  }

  async refreshToken(req: RefreshTokenRequest, res: Response) {
    const device = await deviceQueryRepository.getDeviceById(req.deviceId!);
    if (!device) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }

    const newTokens = await authService.refreshToken(device, req.deviceId!);
    if (!newTokens.data) return res.sendStatus(HTTP_STATUS_CODES[newTokens.status]);

    const { accessToken, refreshToken } = newTokens.data;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60000,
    });
    res.status(HTTP_STATUS_CODES[newTokens.status]).send({ accessToken: accessToken });
  }

  async logout(req: RefreshTokenRequest, res: Response) {
    const resultLogout = await authService.logout(req.deviceId!);
    if (!resultLogout.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
    }
    return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
  }

  async passwordRecoveryCode(req: RequestBody<{ email: string }>, res: Response) {
    const user = await authQueryRepository.findByEmail(req.body.email);
    if (!user) return res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    const result = await authService.passwordRecoveryCode(user);
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  }

  async passwordRecovery(
    req: RequestBody<{ recoveryCode: string; newPassword: string }>,
    res: Response
  ) {
    const user = await authQueryRepository.findByRecoveryCode(req.body.recoveryCode);
    if (!user) return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
    const result = await authService.passwordRecovery(user, req.body.newPassword);
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  }
}

export const authController = new AuthController();

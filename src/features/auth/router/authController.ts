import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { AuthService } from '../service/authService';
import { Response } from 'express';
import { UserRequest, RequestBody, DeviceRequest } from '../../../shared/types/api.types';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';
import { DeviceQueryRepository } from '../../device/repository/deviceQueryRepository';
import { AuthQueryRepoImpl } from '../database/authQueryRepoImpl';
import { inject, injectable } from 'inversify';
@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) readonly authService: AuthService,
    @inject(AuthQueryRepoImpl) readonly authQueryRepository: AuthQueryRepoImpl,
    @inject(DeviceQueryRepository) readonly deviceQueryRepository: DeviceQueryRepository
  ) {}

  login = async (req: RequestBody<AuthDto>, res: Response) => {
    const loginResult = await this.authService.login(req.body, {
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
  };

  profile = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    const user = await this.authQueryRepository.getUserById(req.user);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(user);
  };

  registration = async (req: RequestBody<InputRegistrationDto>, res: Response) => {
    const result = await this.authService.registration(req.body);
    if (!result.data && result.errorMessage)
      return res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };

  registrationConfirmation = async (req: RequestBody<{ code: string }>, res: Response) => {
    const result = await this.authService.registrationConfirmation(req.body.code);
    if (!result.data && result.errorMessage)
      return res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };

  registrationEmailResending = async (req: RequestBody<{ email: string }>, res: Response) => {
    const result = await this.authService.registrationEmailResending(req.body.email);
    if (!result.data && result.errorMessage)
      return res.status(HTTP_STATUS_CODES[result.status]).send({
        [result.errorMessage]: result.extensions,
      });
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };

  refreshToken = async (req: DeviceRequest, res: Response) => {
    const newTokens = await this.authService.refreshToken(req.deviceId!);
    if (!newTokens.data) return res.sendStatus(HTTP_STATUS_CODES[newTokens.status]);

    const { accessToken, refreshToken } = newTokens.data;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60000,
    });
    res.status(HTTP_STATUS_CODES[newTokens.status]).send({ accessToken: accessToken });
  };

  logout = async (req: DeviceRequest, res: Response) => {
    const resultLogout = await this.authService.logout(req.deviceId!);
    if (!resultLogout.data) {
      return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
    }
    return res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
  };

  passwordRecoveryCode = async (req: RequestBody<{ email: string }>, res: Response) => {
    const result = await this.authService.passwordRecoveryCode(req.body.email);
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };

  passwordRecovery = async (
    req: RequestBody<{ recoveryCode: string; newPassword: string }>,
    res: Response
  ) => {
    const result = await this.authService.passwordRecovery(req.body);
    if (!result.data) return res.sendStatus(HTTP_STATUS_CODES[result.status]);
    res.sendStatus(HTTP_STATUS_CODES[result.status]);
  };
}

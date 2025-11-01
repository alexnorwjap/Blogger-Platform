import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';
import { UserRequest, RequestBody, RefreshTokenRequest } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';
import { emailAdapter } from '../adapter/emailAdapter';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';

class AuthController {
  async login(req: RequestBody<AuthDto>, res: Response) {
    const user = await authQueryRepository.findByLoginOrEmail(req.body);
    if (!user) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    const loginResult = await authService.login(req.body, user);

    if (loginResult.data) {
      res.cookie('refreshToken', loginResult.data.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60000,
      });
      res
        .status(HTTP_STATUS_CODES[loginResult.status])
        .send({ accessToken: loginResult.data.accessToken });
    } else {
      res.sendStatus(HTTP_STATUS_CODES[loginResult.status]);
    }
  }

  async profile(req: UserRequest, res: Response) {
    if (!req.user) return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
    const user = await authQueryRepository.getProfile(req.user);
    res.status(HTTP_STATUS_CODES.SUCCESS).send(user);
  }

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

  async refreshToken(req: RefreshTokenRequest, res: Response) {
    const { user, device } = req;

    const newTokens = await authService.refreshToken(user!.userId, device!);
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

  async logout(req: RefreshTokenRequest, res: Response) {
    const { device } = req;
    const resultLogout = await authService.deleteDevice(device!.deviceId);
    if (resultLogout.data) {
      res.sendStatus(HTTP_STATUS_CODES[resultLogout.status]);
      return;
    }
    if (resultLogout.errorMessage) {
      res.status(HTTP_STATUS_CODES[resultLogout.status]).send({
        [resultLogout.errorMessage]: resultLogout.extensions,
      });
      return;
    }
  }
}

export const authController = new AuthController();

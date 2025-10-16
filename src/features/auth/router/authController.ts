import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';
import { jwtService } from '../infrastructure/jwtService';
import { UserRequest, RequestBody } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';
import { emailAdapter } from '../adapter/emailAdapter';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { AuthDto } from '../repository/dto/authDto';

const account = {
  user: 'tina.hoeger@ethereal.email',
  pass: '5VMbYbuc3tPTVADKSk',
};

class AuthController {
  async login(req: RequestBody<AuthDto>, res: Response) {
    const userId = await authQueryRepository.findByLoginOrEmail(req.body);
    if (!userId) {
      res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST400);
      return;
    }
    const correctCredentials = await authService.correctCredentials(req.body, userId);

    if (correctCredentials) {
      const token = jwtService.generateToken(correctCredentials);
      res.status(HTTP_STATUS_CODES.OK_200).send({
        accessToken: token,
      });
    } else {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
    }
  }

  async profile(req: UserRequest, res: Response) {
    const user = await authQueryRepository.getProfile(req.user!);
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
    emailAdapter.sendEmail(req.body, confirmationCode);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }

  async registrationConfirmation(req: RequestBody<{ code: string }>, res: Response) {
    const user = await authQueryRepository.findByConfirmationCode(req.body.code);
    if (!user) {
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
      authService.deleteUser(user.userId);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST400).send({
        errorsMessages: [
          {
            message: 'Code expired',
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
    emailAdapter.sendEmail(user, newConfirmationCode);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  }
}

export const authController = new AuthController();

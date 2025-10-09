import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';
import { jwtService } from '../infrastructure/jwtService';
import { UserRequest } from '../../../shared/types/api.types';
import { authQueryRepository } from '../database/authQueryRepoImpl';

class AuthController {
  async login(req: Request, res: Response) {
    const userId = await authService.loginCheck(req.body);

    if (userId) {
      const token = jwtService.generateToken(userId);
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
}

export const authController = new AuthController();

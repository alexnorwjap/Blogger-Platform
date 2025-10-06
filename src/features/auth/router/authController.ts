import { HTTP_STATUS_CODES } from '../../../shared/constants/http-status';
import { authService } from '../service/authService';
import { Request, Response } from 'express';

class AuthController {
  async login(req: Request, res: Response) {
    const login = await authService.loginCheck(req.body);
    if (login) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
    } else {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
    }
  }
}

export const authController = new AuthController();

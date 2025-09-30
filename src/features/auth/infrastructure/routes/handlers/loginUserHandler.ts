import { HTTP_STATUS_CODES } from '../../../../../shared/constants/http-status';
import { loginService } from '../../service/loginService';
import { Request, Response } from 'express';

export const loginUser = async (req: Request, res: Response) => {
  const loginDto = req.body;
  const login = await loginService.loginCheck(loginDto);
  if (login) {
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT204);
  } else {
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED401);
  }
};

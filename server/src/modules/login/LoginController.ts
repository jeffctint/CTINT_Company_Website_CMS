import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { login, logout } from './LoginService';

export const loginWithEmailAndPassword = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg } = await login(req.body);

  logger.info(`Login: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({ data: result, resultCode: resultCode, errMsg: errMsg, message: 'login' });
};

export const logoutCheckDatetimeWithEmail = async (req: Request, res: Response): Promise<any> => {
  const { result } = await logout(req.body);

  logger.info(`Logout: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({ data: result, message: 'logout' });
};

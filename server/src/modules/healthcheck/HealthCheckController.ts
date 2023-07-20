import { Request, Response } from 'express';
import { checkServerHealth } from './HealthCheckService';
import { StatusCodes } from 'http-status-codes';

export const healthCheck = async (_req: Request, res: Response): Promise<any> => {
  const result = await checkServerHealth();
  res.status(StatusCodes.OK).json({ data: result, message: 'healthCheck', isSuccess: true });
};

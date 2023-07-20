import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

// Error handling Middleware function for logging the error message
const customLogger = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const message: string = error.message;
  const status: number = error.status;
  logger.error(`[${req.method}] ${req.path} >> Status Code: ${status} Message: ${message}`);
  if (res.headersSent) {
    next(error);
  }
  next(error);
};

export { customLogger as ErrorLogger };

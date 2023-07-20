import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

// Error handling Middleware function for sending the error message
const customResponder = (error: HttpException, _req: Request, res: Response, next: NextFunction) => {
  const message: string = error.message || 'Something went wrong';
  const status: number = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).send({ code: status, errorMessage: message });
  next(error);
};

export { customResponder as ErrorResponder };

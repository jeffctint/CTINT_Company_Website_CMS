import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { HttpException } from '@/exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

/**
 * For operation targeting a single user, we need to check if the user is of role 'USER' and is the same as the one being targeted
 *
 * If the user is of role 'ADMIN', we allow the operation
 *
 * If the user is of role 'USER' and is not the same as the one being targeted, we throw an error
 *
 * @async
 * @param {*} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {unknown}
 */
export const verifyUser = async (req: any, _res: Response, next: NextFunction) => {
  if (req.params.id) {
    if (req?.user?._id?.toString() !== req.params.id && req.user.role === 'USER') {
      return next(new HttpException(StatusCodes.FORBIDDEN, 'Operation not allowed'));
    }
  }
  next();
};

const verifyCallback = (req: Request, resolve: any, reject: any, requiredPermissions: string[]) => async (err: any, user: any) => {
  if (err) {
    return reject(err);
  }
  if (!user) {
    return reject(new HttpException(StatusCodes.UNAUTHORIZED, 'Unauthorized access'));
  }
  req.user = user;

  // Check for permission in role
  if (requiredPermissions.length > 0) {
    const hasPermissions = requiredPermissions.some((permission: string) => user.permissions.includes(permission));
    if (!hasPermissions) {
      return reject(new HttpException(StatusCodes.FORBIDDEN, 'Forbidden access'));
    }
  }

  resolve();
};

const authMiddleware =
  (requiredPermissions: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredPermissions))(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };

export { authMiddleware as authenticate };

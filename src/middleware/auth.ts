import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../helpers/ApiError';
import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '../interfaces/UserInterface';

export interface CustomRequest extends Request {
    user?: UserInterface;
}

const verifyCallback = (req: Request, resolve: any, reject: any) => async (err: Error, user: UserInterface, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  resolve();
};

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
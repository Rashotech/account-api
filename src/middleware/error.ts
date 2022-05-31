import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import configs from '../config';
import ApiError from '../helpers/ApiError';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (configs.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(configs.env === 'development' && { stack: err.stack }),
  };

  if (configs.env === 'development') {
    console.error(err);
  }

  return res.status(statusCode).send(response);
};

export default {
  errorConverter,
  errorHandler,
};
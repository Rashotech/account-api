import catchAsync from "../helpers/catchAsync";
import { Request, Response } from "express";
import httpStatus from 'http-status';

import userService from '../services/user.service';
import accountService from '../services/account.service';
import tokenService from '../services/token.service';


const register = catchAsync(async (req: Request, res: Response) : Promise<void> => {
  let user: any = await userService.createUser(req.body);
  delete user.password;
  const tokens = await tokenService.generateAuthTokens(user);
  const account = await accountService.createAccount(user.id);
  res.status(httpStatus.CREATED).send({ user, account, tokens }); 
});

const login = catchAsync(async (req: Request, res: Response) : Promise<void> => {
  const { email, password } = req.body;
  let user = await userService.loginWithEmail(email, password);
  delete user.password;
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req: Request, res: Response) : Promise<void> => {
  await userService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) : Promise<void> => {
  const tokens = await userService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});


export default {
  register,
  login,
  logout,
  refreshTokens,
};
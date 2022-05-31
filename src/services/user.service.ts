import ApiError from "../helpers/ApiError";
import httpStatus from 'http-status';
import { UserInterface } from '../interfaces/UserInterface';
import { createNewUser, findUserByEmail, isPasswordMatch, hashPassword, findUser } from '../models/user.model';
import tokenService from './token.service';
import tokenTypes from '../config/tokens';
import { findToken, deleteToken } from '../models/token.model';

const createUser = async (userBody: UserInterface) => {
  if (await findUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken.');
  }
  userBody.password = await hashPassword(userBody.password);
  const userId = await createNewUser(userBody);
  const user = await findUser(userId[0]);
  return user;
};

const loginWithEmail = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user || !(await isPasswordMatch(email, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect credentials');
  }
  return user;
};

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await findToken({ token: refreshToken, type: tokenTypes.REFRESH });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await findUser(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await deleteToken(refreshTokenDoc.id);
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


export default {
  createUser,
  loginWithEmail,
  logout,
  refreshAuth
};
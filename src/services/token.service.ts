import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config'
import { UserInterface } from '../interfaces/UserInterface';
import  TokenTypes from '../config/tokens';
import { createNewToken, findToken } from '../models/token.model'


const generateToken = (userId: number, expires: any, type: string, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token: string, userId: number, expires: any, type: string) => {
  const tokenDoc = await createNewToken({
    token,
    user_id: userId,
    expires: expires.toDate(),
    type,
  });
  return tokenDoc;
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await findToken({ token, type, user: payload.sub });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: UserInterface) => {
  const accessTokenExpires = moment().add(config.jwt.access_expiry, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refresh_expiry, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};


export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens
};
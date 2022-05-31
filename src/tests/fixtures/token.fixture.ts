import moment from 'moment';
import configs from '../../config';
import tokens from '../../config/tokens';
import tokenService from '../../services/token.service';
import Users from './user.fixture'

const accessTokenExpires = moment().add(configs.jwt.access_expiry, 'minutes');
const userOneAccessToken = tokenService.generateToken(Users.userOne.id, accessTokenExpires, tokens.ACCESS);
const userTwoAccessToken = tokenService.generateToken(Users.userTwo.id, accessTokenExpires, tokens.ACCESS);

export {
  userOneAccessToken,
  userTwoAccessToken,
};
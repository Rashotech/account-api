import Joi from 'joi';

const password = (value: string, helpers: any) => {
    if (value.length < 8) {
      return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};

const register = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().required(),
});

const login = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const logout = Joi.object().keys({
    refreshToken: Joi.string().required(),
});

const refreshTokens = Joi.object().keys({
    refreshToken: Joi.string().required()
});

export default {
  register,
  login,
  logout,
  refreshTokens,
};
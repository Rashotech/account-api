import Joi from 'joi';

const fundAccount = Joi.object().keys({
    amount: Joi.number().required(),
    account_number: Joi.string().required(),
});

const transferFund = Joi.object().keys({
    amount: Joi.number().required(),
    account_number: Joi.string().required(),
    beneficiary_account: Joi.number().required()
});

export default {
  fundAccount,
  transferFund
};
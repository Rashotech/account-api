import db from "../config/db";

const createNewTransaction = async (option: any) => {
  return await db('transactions').insert(option)
};

const findTransactionsByAccount = async(accountId: number) => {
  return await db('transactions').where({ account_id: accountId });
};

export {
    createNewTransaction,
    findTransactionsByAccount
};
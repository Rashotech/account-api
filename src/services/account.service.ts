import ApiError from "../helpers/ApiError";
import httpStatus from "http-status";
import {
  createNewAccount,
  findAccount,
  findByAccountNumber,
  fundAccount as fund,
  withdraw,
  transferFund as transfer,
  findAllAccounts,
  retrieveAccountTransactions,
} from "../models/account.model";
import generateAccountNumber from "../helpers/accountNoGenerator";
import { AccountInterface } from "../interfaces/AccountInterface";

const createAccount = async (userId: number) => {
  try {
    const accountNumber = await createNewAccount({
      account_number: generateAccountNumber(),
      user_id: userId,
    });
    const account = await findAccount(accountNumber[0]);
    return account;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to Create Account");
  }
};

const listAllAccounts = async (userId: number) => {
  try {
    const accounts = await findAllAccounts(userId);
    return accounts;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to Fetch Accounts");
  }
};

const getAccountInfo = async (userId: number, accountNo: string) => {
  const account_details: AccountInterface = await findByAccountNumber(
    accountNo
  );
  if (account_details && account_details.user_id !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized");
  }
  if (!account_details) {
    throw new ApiError(httpStatus.NOT_FOUND, "Account Number does not exist");
  }
  return account_details;
};

const fundAccount = async (
  userId: number,
  amount: number,
  account_number: string
) => {
  const account: AccountInterface = await findByAccountNumber(account_number);
  if (
    !account ||
    account.user_id !== userId ||
    account.account_status !== "active"
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized");
  }
  return await fund(account.id, amount);
};

const transferFund = async (
  userId: number,
  amount: number,
  account_number: string,
  beneficiary_account: string
) => {
  const account: AccountInterface = await findByAccountNumber(account_number);
  const benef_account: AccountInterface = await findByAccountNumber(
    beneficiary_account
  );
  if (
    !account ||
    account.user_id !== userId ||
    account.account_status !== "active"
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized");
  }
  if (account && account_number === beneficiary_account) {
    throw new ApiError(httpStatus.OK, "You cannot transfer to yourself");
  }
  if (!benef_account || benef_account.account_status !== "active") {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipient account does not exist or cannot receive funds"
    );
  }
  if (account && account.account_balance < amount) {
    throw new ApiError(httpStatus.OK, "Insufficient Balance");
  }
  return await transfer(account, benef_account, amount);
};

const withdrawFromAccount = async (
  userId: number,
  amount: number,
  account_number: string
) => {
  const account: AccountInterface = await findByAccountNumber(account_number);
  if (
    !account ||
    account.user_id !== userId ||
    account.account_status !== "active"
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized");
  }
  if (account && account.account_balance < amount) {
    throw new ApiError(httpStatus.OK, "Insufficient Balance");
  }
  return await withdraw(account.id, amount);
};

const transactiondetails = async (userId: number, account_number: string) => {
  const account: AccountInterface = await findByAccountNumber(account_number);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, "Account Number does not exist");
  }

  if (account.user_id !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized");
  }

  const transactions = await retrieveAccountTransactions(account.id);
  return transactions;
};

export default {
  createAccount,
  fundAccount,
  transferFund,
  withdrawFromAccount,
  listAllAccounts,
  getAccountInfo,
  transactiondetails,
};

import db from "../config/db";
import { AccountInterface } from "../interfaces/AccountInterface";

const createNewAccount = async (option: any) => {
  return await db("account").insert(option);
};

const findAccount = async (id: number) => {
  return await db("account").where("id", id).first();
};

const findAllAccounts = async (id: number) => {
  return await db("account").where("user_id", id);
};

const findByAccountNumber = async (accountNo: string) => {
  return await db("account").where({ account_number: accountNo }).first();
};

const retrieveAccountTransactions = async (accountId: number) => {
  return await db("transactions")
    .where("account_id", accountId)
    .orderBy("created_at", "desc");
};

const fundAccount = async (accountId: number, amount: number) => {
  // Initiate DB Transaction
  try {
    await db.transaction(async (trx) => {
      // Increase Account Balance
      await trx("account")
        .where("id", "=", accountId)
        .increment("account_balance", amount);

      // Log Account funding
      await trx("transactions").insert({
        account_id: accountId,
        transaction_type: "credit",
        transaction_amount: amount,
        transaction_description: "Account Funding",
        transaction_status: "successful",
      });
      return true;
    });
  } catch (error) {
    // Roll Back If There is Error
    console.error(error);
    throw Error(error);
  }
};

const withdraw = async (accountId: number, amount: number) => {
  // Initiate DB Transaction
  try {
    await db.transaction(async (trx) => {
      // Increase Account Balance
      await trx("account")
        .where("id", "=", accountId)
        .decrement("account_balance", amount);

      // Log Withdrawal
      await trx("transactions").insert({
        account_id: accountId,
        transaction_type: "debit",
        transaction_amount: amount,
        transaction_description: "Withdrawal",
        transaction_status: "successful",
      });
      return true;
    });
  } catch (error) {
    // Roll Back If There is Error
    console.error(error);
    throw Error(error);
  }
};

const transferFund = async (
  source_account: AccountInterface,
  beneficiary_account: AccountInterface,
  amount: number
) => {
  // Initiate DB Transaction
  try {
    await db.transaction(async (trx) => {
      // Decrease Sender Account Balance
      await trx("account")
        .where("id", "=", source_account.id)
        .decrement("account_balance", amount);

      // Log debit
      await trx("transactions").insert({
        account_id: source_account.id,
        transaction_type: "debit",
        transaction_amount: amount,
        transaction_description: `Transfer of ${amount} to ${beneficiary_account.account_number}`,
        transaction_status: "successful",
      });

      // Increase Beneficiary Account Balance
      await trx("account")
        .where("id", "=", beneficiary_account.id)
        .increment("account_balance", amount);

      // Log Credit
      await trx("transactions").insert({
        account_id: beneficiary_account.id,
        transaction_type: "credit",
        transaction_amount: amount,
        transaction_description: `Recieved ${amount} from ${source_account.account_number}`,
        transaction_status: "successful",
      });
      return true;
    });
  } catch (error) {
    // Roll Back If There is Error
    console.error(error);
    throw Error(error);
  }
};

export {
  createNewAccount,
  findAccount,
  findAllAccounts,
  findByAccountNumber,
  fundAccount,
  withdraw,
  transferFund,
  retrieveAccountTransactions,
};

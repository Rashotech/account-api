import catchAsync from "../helpers/catchAsync";
import { Response } from "express";
import httpStatus from "http-status";
import accountService from "../services/account.service";
import { CustomRequest } from "../middleware/auth";

const createAccount = catchAsync(async (req: CustomRequest, res: Response) => {
  const account = await accountService.createAccount(req.user.id);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Account Created Successfully", data: account });
});

const listAllAccounts = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const accounts = await accountService.listAllAccounts(req.user.id);
    res
      .send({ message: "Accounts Fetched Successfully", data: accounts });
  }
);

const transactiondetails = catchAsync(
  async (req: CustomRequest, res: Response) => {
    if (!req.params.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "Account number required" });
    }
    const transactions = await accountService.transactiondetails(
      req.user.id,
      req.params.id
    );
    res
      .send({
        message: "Transaction details Fetched Successfully",
        data: transactions,
      });
  }
);

const getAccountInfo = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.params.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Account number required" });
  }
  const account = await accountService.getAccountInfo(
    req.user.id,
    req.params.id
  );
  res
    .send({
      message: "Account Details Fetched Successfully",
      data: account
    });
});

const fundAccount = catchAsync(async (req: CustomRequest, res: Response) => {
  const { amount, account_number } = req.body;
  const { id } = req.user;
  await accountService.fundAccount(id, amount, account_number);
  res.send({ message: "Account Funded Successfully" });
});

const withdrawFromAccount = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { amount, account_number } = req.body;
    const { id } = req.user;
    await accountService.withdrawFromAccount(id, amount, account_number);
    res.send({ message: "Fund Withdawal Successful" });
  }
);

const transferFund = catchAsync(async (req: CustomRequest, res: Response) => {
  const { amount, account_number, beneficiary_account } = req.body;
  const { id } = req.user;
  await accountService.transferFund(
    id,
    amount,
    account_number,
    beneficiary_account
  );
  res.send({ message: "Fund Transfer Successful" });
});

export default {
  createAccount,
  fundAccount,
  withdrawFromAccount,
  transferFund,
  listAllAccounts,
  getAccountInfo,
  transactiondetails
};

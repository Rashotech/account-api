import express from 'express';
import accountValidation from '../validations/account.validation';
import accountController from '../controllers/account.controller';
import validate from '../middleware/validate';
import auth from '../middleware/auth'

const router = express.Router();

router.post('/create', auth(), accountController.createAccount);
router.post('/fund', auth(), validate(accountValidation.fundAccount), accountController.fundAccount);
router.post('/withdraw', auth(), validate(accountValidation.fundAccount), accountController.withdrawFromAccount);
router.post('/transfer', auth(), validate(accountValidation.transferFund), accountController.transferFund);
router.get('/list', auth(), accountController.listAllAccounts);
router.get('/:id/balance', auth(), accountController.getAccountInfo);
router.get('/:id/transactions', auth(), accountController.transactiondetails);

export default router;
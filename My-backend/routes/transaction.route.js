import {Router} from 'express';

import {createTransaction,getTransactions,getTransactionById,updateTransaction,deleteTransaction} from '../controller/transaction.controller.js';
import { authenticateUser } from '../middleware/user.middleware.js';

const router = Router();
router.use(authenticateUser);
router.route('/create').post(createTransaction);
router.route('/get').get(getTransactions);
router.route('/get/:id').get(getTransactionById);
router.route('/update/:id').put(updateTransaction);
router.route('/delete/:id').delete(deleteTransaction);
export default router;
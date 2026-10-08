import {Router} from 'express';
import {createTransaction,getTransactions,getTransactionById,updateTransaction,deleteTransaction, getDashboardStats} from '../controller/transaction.controller.js';

const router = Router();
router.route('/create').post(createTransaction);
router.route('/get').get(getTransactions);
router.route('/get/:id').get(getTransactionById);
router.route('/update/:id').put(updateTransaction);
router.route('/delete/:id').delete(deleteTransaction);
router.route('/getdata').get(getDashboardStats)
export default router;
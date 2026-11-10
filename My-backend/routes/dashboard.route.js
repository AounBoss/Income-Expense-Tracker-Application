import {Router} from 'express';
import { getDashboardStats } from '../controller/dashboard.controller.js';
import { authenticateUser } from '../middleware/user.middleware.js';
const router = Router();
router.use(authenticateUser);
router.route('/get').get(getDashboardStats);

export default router;
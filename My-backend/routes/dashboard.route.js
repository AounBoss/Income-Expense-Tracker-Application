import {Router} from 'express';
import { getDashboardStats } from '../controller/dashboard.controller.js';
const router = Router();

router.route('/get').get(getDashboardStats);

export default router;
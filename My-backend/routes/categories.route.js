import {Router} from 'express';
import {createCategory,getCategories, deleteCategory} from '../controller/categories.controller.js';
const router = Router();
router.route('/create').post(createCategory);
router.route('/get').get(getCategories);
router.route('/delete/:id').delete(deleteCategory);
export default router;
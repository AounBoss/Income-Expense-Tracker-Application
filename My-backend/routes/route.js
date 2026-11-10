import {Router} from 'express';
import {loginUser,registerUser,logoutuser} from '../controller/controller.js';
import { authenticateUser } from "../middleware/user.middleware.js";
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

export default router;
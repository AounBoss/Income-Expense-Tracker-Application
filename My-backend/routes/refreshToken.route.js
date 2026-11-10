
import {Router} from "express";

import {
  refreshAccessToken,
} from "../controller/controller.js";
import { authenticateUser } from "../middleware/user.middleware.js";

const router = Router();

// router.use(authenticateUser);
router.route("/refresh").post(refreshAccessToken);

export default router;

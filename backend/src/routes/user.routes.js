import { Router } from "express";
import { verfiyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/getPostData').post(verfiyUser)

export default router;
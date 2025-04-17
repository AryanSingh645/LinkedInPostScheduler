import { Router } from "express";
import { verfiyUser } from "../middleware/auth.middleware.js";
import { createUserPost, getDashboardData, logout } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/schedulePost').post(upload.fields([
    {
        name: "gallery"
    }
]), verfiyUser, createUserPost);

router.route('/getDashboardData').get(verfiyUser, getDashboardData)
router.route('/logout').get(verfiyUser, logout)

export default router;
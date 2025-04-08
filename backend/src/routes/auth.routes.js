import { Router } from "express";
import { getAccessToken, getAuthorizationCode } from "../controllers/auth.controller.js";

const router = Router();

router.route('/getAuthorizationCode').get(getAuthorizationCode);
router.route('/callback').get(getAccessToken);

export default router;
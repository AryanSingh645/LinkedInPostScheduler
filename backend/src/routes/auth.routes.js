import { Router } from "express";
import { getAccessToken, getAuthorizationCode, verifyUser } from "../controllers/auth.controller.js";

const router = Router();

// NOTE: Authmiddleware must be used on every to protect the use of api calls 

router.route('/getAuthorizationCode').get(getAuthorizationCode);
router.route('/callback').get(getAccessToken);
router.route('/verify').get(verifyUser);

export default router;
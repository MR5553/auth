import { Router } from "express";
import {
    signup,
    signin,
    verifyemail,
    ResendEmailVerificationCode,
    signout,
    getProfile,
    updateAccountDetail
} from "../controller/user.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/verifyemail/:id", verifyemail);
router.post("/resend-verification-code/:id", ResendEmailVerificationCode);

router.get("/sign-out", auth, signout);
router.get("/current-user", auth, getProfile);
router.get("/update-user", auth, updateAccountDetail);

export default router;
import { Router } from "express";
import { getUser, ResendEmailVerificationCode, signin, signout, signup, verifyemail } from "../controller/user.controller";
import { auth } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/verifyemail/:id", verifyemail);
router.get("/resend-verification-code/:id", ResendEmailVerificationCode);


router.post("/sign-out", auth, signout);
router.post("/getuser", upload.single("image"), getUser);


export default router;
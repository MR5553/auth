import { Router } from "express";

const router = Router();

import { uploadImage } from "../controller/file.controller";
import { auth } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

router.post("/upload-image", upload.single("image"), auth, uploadImage);

export default router;
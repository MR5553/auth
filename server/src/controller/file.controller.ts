import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile } from "../utils/uploadFile";


const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const { file: image } = req;

    const Formate: string[] = ["image/jpeg", "image/png", "image/gif"];
    const MAX_FILE_SIZE = 1024 * 1024 * 5;

    if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    if (!Formate.includes(image.mimetype)) {
        return res.status(400).json({ message: "Invalid image type" });
    }

    if (image.size > MAX_FILE_SIZE) {
        return res.status(400).json({ message: "File size exceeds the limit" });
    }

    const { URL } = await uploadFile(image);

    return res.status(200).json({
        success: true,
        data: { URL },
    });

});

export { uploadImage };
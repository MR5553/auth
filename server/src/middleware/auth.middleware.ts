import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { Users } from "../model/user.model";
import { jwtToken } from "../types/jwt.type";


const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(403).json({ message: "Access denied" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

        const user = await Users.findById((decoded as jwtToken)._id).select("-profile_info.password");

        if (!user) return res.status(401).json({ message: "Invalid token" });

        req.user = user;

        return next();

    } catch (err) {
        return res.status(500).json({ message: "internal server error", error: err })
    }
});

export { auth };
import { Request, Response } from "express";
import { usertype } from "../types/users.type";
import { Users } from "../model/user.model";
import crypto from "crypto";
import { EmailVerification } from "../mail/nodemailer";
import { asyncHandler } from "../utils/asyncHandler";
import { APIError } from "../utils/APIError";
import { isValidObjectId } from "mongoose";


const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await Users.findById(userId) as usertype;

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new APIError(500, "something went wrong while generating refresh and access token");
    }
};


const option = {
    httpOnly: true,
    secure: true,
};


const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password }: usertype["profile_info"] = await req.body;

    if (!name || !email || !password) {
        return res.json({ message: "name, email, password is required" }).status(404);
    }

    const isUserExist = await Users.findOne({ "profile_info.email": email });

    if (isUserExist) {
        return res.json({ message: "User already exists. Please login instead!" }).status(409);
    }

    const VerificationCode = crypto.randomInt(100000, 999999);

    const createUser = await Users.create({
        profile_info: {
            name,
            email,
            password,
            username: email.split("@")[0]
        },
        verification_code: VerificationCode,
        verification_code_expiry: Date.now() + (60 * 60 * 1000)
    }) as usertype;

    if (!createUser) {
        return res.json({ message: "Error signing up. Please try again." }).status(404)
    }

    //await EmailVerification(email, createUser.verification_code!);

    const user = await Users.findById(createUser._id).select("-refreshToken -verification_code -verification_code_expiry -profile_info.password");

    return res.json({
        message: `we just sent a verification email to ${email}.`,
        success: true,
        user
    }).status(201);

});


const signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username }: usertype["profile_info"] = await req.body;

    if ((!email && !username) || !password) {
        return res.json({ message: "email, password is required" }).status(404);
    }

    const isUserExist = await Users.findOne({
        $or: [{ "profile_info.username": username }, { "profile_info.email": email }]
    }) as usertype;

    if (!isUserExist) {
        throw new APIError(404, "user not found, please signup instead.");
    }

    if (isUserExist.is_verified) {
        const isPasswordvalid = await isUserExist.IsPasswordCorrect(password);

        if (!isPasswordvalid) {
            throw new APIError(404, "password is incorrect, please try again.");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(String(isUserExist._id));

        const user = await Users.findById(isUserExist._id).select("-refreshToken -verification_code -verification_code_expiry -profile_info.password");

        return res.cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .status(200)
            .json({
                user,
                success: true,
                message: "user logged in successfully",
            });
    }

    throw new APIError(401, "Please verify your email first.");

});


const verifyemail = asyncHandler(async (req: Request, res: Response) => {
    const { code }: { code: number } = req.body;

    if (!code) {
        throw new APIError(404, "code is required");
    }

    if (!isValidObjectId(req.params.id)) {
        throw new APIError(400, "invalid user id.");
    }

    const isUserExisting = await Users.findById(req.params.id) as usertype;

    if (!isUserExisting.verification_code_expiry || new Date(isUserExisting.verification_code_expiry) <= new Date()) {
        throw new APIError(400, "Verification code has expired");
    }

    if (isUserExisting.verification_code !== code) {
        throw new APIError(400, "Invalid verification code");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(String(isUserExisting._id));

    isUserExisting.is_verified = true;
    isUserExisting.refreshToken = refreshToken;
    isUserExisting.verification_code = undefined;
    isUserExisting.verification_code_expiry = undefined;
    await isUserExisting.save();

    const user = isUserExisting.toObject();
    delete user.refreshToken;
    delete user.verification_code;
    delete user.verification_code_expiry;
    delete user.profile_info.password;

    return res.cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .status(200)
        .json({
            user,
            success: true,
            message: "email verified successfully",
        });

});


const ResendEmailVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new APIError(404, "user id is missing.");
    }

    if (!isValidObjectId(req.params.id)) {
        throw new APIError(404, "invalid user id.");
    }

    const VerificationCode = crypto.randomInt(100000, 999999);

    const user = await Users.findByIdAndUpdate(req.params.id, {
        verification_code: VerificationCode,
        verification_code_expiry: Date.now() + (60 * 60 * 1000)
    }) as usertype;

    //await EmailVerification(user.profile_info.email, user.verification_code!);

    return res.json({
        success: true,
        message: "verification code sent successfully",
    }).status(200);

});


const signout = asyncHandler(async (req: Request, res: Response) => {
    await Users.findByIdAndUpdate(req.user!._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json({
            success: true,
            message: "user signed out successfully",
        });
});


const getUser = asyncHandler(async (req: Request, res: Response) => {
    const image = req.file;
    console.log(image);
    return res.json({ image });
});


export {
    signup,
    signin,
    verifyemail,
    ResendEmailVerificationCode,
    signout,
    getUser
};
import { Request, Response, CookieOptions } from "express";
import { usertype } from "../types/users.type";
import { Users } from "../model/user.model";
import crypto from "crypto";
import { EmailVerification } from "../mail/nodemailer";
import { asyncHandler } from "../utils/asyncHandler";
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
        throw error("Something went wrong while generating refresh and access token")
    }
};

const option: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 259200000
};


const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password }: usertype["profile_info"] = await req.body;

    if (!name || !email || !password) {
        return res.json({ message: "name, email, password is required" }).status(404);
    }

    const isUserExist = await Users.findOne({ "profile_info.email": email });

    if (isUserExist) {
        if (isUserExist.is_verified) {
            return res.json({ message: "User already exists. Please verify your email." }).status(409);
        }
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
        user: user,
        message: `we just sent a verification email to ${email}.`,
        success: true,
    }).status(201);

});


const signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username }: usertype["profile_info"] = await req.body;

    if ((!email && !username) || !password) {
        return res.status(404).json({ message: "email, password is required" });
    }

    const user = await Users.findOne({
        $or: [{ "profile_info.username": username }, { "profile_info.email": email }]
    }) as usertype;


    if (!user) {
        return res.status(404).json({ message: "user not found, please signup instead." })
    }

    if (!user.is_verified) {
        const unVerifiendUser = await Users.findById(user._id).select("-refreshToken -verification_code -verification_code_expiry -profile_info.password");
        return res.status(200)
            .json({
                user: unVerifiendUser,
                message: "Email is not verified. Please verify your email to continue."
            });
    }

    const isPasswordvalid = await user?.IsPasswordCorrect(password);

    if (!isPasswordvalid) {
        return res.status(400).json({ message: "password is incorrect, please try again." })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(String(user._id));

    const ExistingUser = await Users.findById(user._id).select("-refreshToken -verification_code -verification_code_expiry -profile_info.password");

    return res.cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .status(200)
        .json({
            user: ExistingUser,
            success: true,
            message: "user logged in successfully",
        });
});


const verifyemail = asyncHandler(async (req: Request, res: Response) => {
    const { otp } = req.body;

    if (!otp) return res.status(400).json({ message: "otp code is required" });

    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "invalid user id" });

    const user: usertype = await Users.findById(req.params.id).select("-profile_info.password");

    if (!user.verification_code_expiry || new Date(user.verification_code_expiry) <= new Date()) {
        return res.status(400).json({ message: "Verification code has expired" })
    }

    if (String(user.verification_code) !== String(otp)) {
        return res.status(400).json({ message: "Invalid OTP verification code." })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(String(user._id));

    user.is_verified = true;
    user.refreshToken = refreshToken;
    user.verification_code = undefined;
    user.verification_code_expiry = undefined;
    await user.save();

    return res.cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .status(200)
        .json({
            user: user,
            success: true,
            message: "email verified successfully",
        });

});


const ResendEmailVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) return res.status(404).json({ message: "User id is missing." })

    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "invalid user id" });

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


const getProfile = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        user: req.user,
        message: "current user fetched successfully!.."
    })
});

const updateAccountDetail = asyncHandler(async (req: Request, res: Response) => {
    const { profile_info }: usertype = req.body;

    if (!profile_info) {
        return res.json({
            message: "Details is required."
        });
    }

    const user = await Users.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                ...profile_info
            }
        },
        { new: true }
    ).select("-profile_info.password");

    return res.status(200).json({
        success: true,
        message: "user details updated.",
        user: user
    })
});

const changePassword = asyncHandler(async (req: Request, res: Response) => { });

const forgotPassword = asyncHandler(async (req: Request, res: Response) => { });


export {
    signup,
    signin,
    signout,
    getProfile,
    verifyemail,
    forgotPassword,
    changePassword,
    updateAccountDetail,
    ResendEmailVerificationCode,
};
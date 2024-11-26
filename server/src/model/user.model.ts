import { model, Schema } from "mongoose";
import { usertype } from "../types/users.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.type";

const userSchema = new Schema<usertype>({
    profile_info: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        profile_img: {
            type: String,
            default: ""
        },
        cover_img: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            trim: true
        }
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_likes: {
            type: Number,
            default: 0
        }
    },
    social_links: {
        instagram: {
            type: String,
            default: "",
            trim: true
        },
        youtube: {
            type: String,
            default: "",
            trim: true
        },
        facebook: {
            type: String,
            default: "",
            trim: true
        },
        twitter: {
            type: String,
            default: "",
            trim: true
        },
        github: {
            type: String,
            default: "",
            trim: true
        },
        website: {
            type: String,
            default: "",
            trim: true
        }
    },
    bookmarks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "posts"
        }],
        default: []
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_code: {
        type: Number,
    },
    verification_code_expiry: {
        type: Date,
        default: null
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "posts"
        }],
        default: []
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre<usertype>("save", async function (next) {
    if (!this.isModified("profile_info.password")) {
        return next()
    }
    this.profile_info.password = await bcrypt.hash(this.profile_info.password, 12);
    next();
});

userSchema.methods.IsPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.profile_info.password)
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.profile_info.email,
            username: this.profile_info.username,
        } as jwtToken,
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "3d"
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.profile_info.email,
            username: this.profile_info.username,
        } as jwtToken,
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d"
        }
    )
};

export const Users = model<usertype>("Users", userSchema);
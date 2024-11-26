import { Document, Types } from "mongoose";

export interface usertype extends Document {
    profile_info: {
        name: string;
        username: string;
        email: string;
        password: string;
        profile_img: string;
        cover_img: string;
        bio: string;
    }
    account_info: {
        total_posts: number;
        total_reads: number;
        total_likes: number
    };
    social_links: {
        instagram: string;
        youtube: string;
        facebook: string;
        twitter: string;
        github: string;
        website: string;
    };
    bookmarks: Types.ObjectId[];
    is_verified: boolean;
    verification_code: number | undefined;
    verification_code_expiry: Date | undefined;
    posts: Types.ObjectId[];
    refreshToken: string;
    generateRefreshToken(): string;
    generateAccessToken(): string;
    IsPasswordCorrect(password: string): Promise<boolean>;
}
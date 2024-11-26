export interface ApiResponse {
    message: string;
    user: {
        profile_info: {
            name: string;
            username: string;
            email: string;
            profile_img: string;
            cover_img: string;
            bio: string;
        },
        account_info: {
            total_posts: number;
            total_reads: number;
            total_likes: number;
        },
        social_links: {
            instagram: string;
            youtube: string;
            facebook: string;
            twitter: string;
            github: string;
            website: string;
        },
        accessToken: string;
        refreshToken: string;
        bookmarks: string[];
        is_verified: boolean;
        verification_code: number;
        verification_code_expiry: string;
        posts: [];
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    },
    success: boolean;
}
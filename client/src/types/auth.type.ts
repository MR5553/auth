export interface userState {
    user: {
        profile_info: {
            name: string;
            username: string;
            email: string;
            profile_img: string;
            cover_img: string;
            bio: string;
        };
        account_info: {
            total_posts: number;
            total_reads: number;
            total_likes: number;
        };
        social_links: {
            instagram: string;
            youtube: string;
            facebook: string;
            twitter: string;
            github: string;
            website: string;
        };
        _id: string;
        bookmarks: string[];
        posts: string[];
        createdAt: string;
        updatedAt: string;
        is_verified: boolean;
    };
    hydrated: boolean;
    isAuthenticated: boolean;
};

export interface action {
    setHydrated: () => void;
    SignIn: (user: userState["user"]) => void;
    Signup: (user: userState["user"]) => void;
    getProfile: () => Promise<void>;
    SignOut: () => void;
};
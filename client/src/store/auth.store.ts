import { create } from "zustand";
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"
import axios from "axios";
import { ApiResponse } from "../types/axios.type";

interface userState {
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
    },
    hydrated: boolean;
    isAuthenticated: boolean;
};

interface action {
    setHydrated: () => void;
    SignIn: (email: string, password: string) => Promise<void>;
    Signup: (name: string, email: string, password: string) => Promise<void>;
    VerifyEmail: (code: number) => Promise<void>;
    SignOut: () => void;
};


export const useAuthStore = create<userState & action>()(
    persist(
        immer((set) => ({
            user: {
                profile_info: {
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    profile_img: "",
                    cover_img: "",
                    bio: "",
                },
                account_info: {
                    total_likes: 0,
                    total_posts: 0,
                    total_reads: 0
                },
                social_links: {
                    instagram: "",
                    youtube: "",
                    facebook: "",
                    twitter: "",
                    github: "",
                    website: ""
                },
                _id: "",
                bookmarks: [],
                is_verified: false,
                posts: [],
                createdAt: "",
                updatedAt: ""
            },
            hydrated: false,
            isAuthenticated: false,

            SignIn: async (email: string, password: string) => {
                try {
                    const res = await axios.post<ApiResponse>("/api/auth/signin", { email, password });
                    const { user, success } = res.data;

                    if (success) {
                        set({
                            user: {
                                ...user,
                            },
                            isAuthenticated: true,
                            hydrated: true,
                        });
                    }

                } catch (error) {
                    console.error(error);
                }
            },
            Signup: async (name: string, email: string, password: string) => {
                try {
                    const res = await axios.post<ApiResponse>("/api/auth/signin", { name, email, password });

                    const { user, success } = res.data;

                    if (success) {
                        set({
                            user: {
                                ...user
                            },
                            isAuthenticated: false
                        })
                    }

                } catch (error) {
                    console.error(error);
                }
            },
            VerifyEmail: async (code) => {
                try {
                    const res = await axios.post<ApiResponse>("/api/auth/verify-email", { code });
                    const { user, success } = res.data;

                    if (success && user.is_verified) {
                        set({
                            user: { ...user },
                            isAuthenticated: true,
                        });
                    }

                } catch (error) {
                    console.error(error);
                }
            },
            SignOut: async () => {
                try {
                    const res = await axios.post<{ status: number }>("/api/auth/signout");

                    if (res.data.status === 200) {
                        set({
                            user: {} as userState["user"],
                            isAuthenticated: false,
                        })
                    }

                } catch (error) {
                    console.error(error);
                }
            },
            setHydrated: () => {
                set({ hydrated: true })
            }
        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) {
                        state?.setHydrated();
                    }
                };
            }
        }
    )
);
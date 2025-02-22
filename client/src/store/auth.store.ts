import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { action, userState } from "../types/auth.type";
import axios from "axios";
import { ApiResponse } from "../types/axios.type";


export const useAuthStore = create<userState & action>()(
    persist(
        immer((set) => ({
            user: {
                profile_info: {
                    name: "",
                    username: "",
                    email: "",
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

            SignIn: (user) => {
                set({
                    user: {
                        ...user
                    },
                    isAuthenticated: true
                })
            },
            Signup: (user) => {
                set({
                    user: {
                        ...user
                    },
                })
            },
            SignOut: async () => {
                set({
                    user: {} as userState["user"],
                    isAuthenticated: false,
                })
            },
            getProfile: async () => {
                try {
                    const { data: { success, user } } = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/auth/current-user`, { withCredentials: true });

                    if (success) {
                        set({
                            user: {
                                ...user
                            },
                            isAuthenticated: true
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
            },
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
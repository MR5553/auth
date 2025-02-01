import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { signInSchema } from "../../lib/user.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import axios from "axios";
import { ApiResponse } from "../../types/axios.type";


export default function SignIn() {
    const [visible, setVisible] = useState<boolean>(false);
    const { SignIn } = useAuthStore((state) => state);

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signInSchema),
        mode: "all",
    });


    const submit = async ({ email, password }: { email: string, password: string }) => {
        try {
            const { data: { user, success } } = await axios.post<ApiResponse>("https://techbyte-v1a6.vercel.app/api/auth/sign-in", { email, password });

            if (success) {
                SignIn(user);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="flex flex-col gap-4 items-center justify-center h-dvh select-none">
            <form onSubmit={handleSubmit(submit)} className="w-[20rem] grid gap-5">
                <div>
                    <h1 className="text-3xl font-medium text-primary dark:text-white tracking-wider">
                        Welcome back!
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                        Sign in to unlock your personalized dashboard
                    </p>
                </div>

                <div>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        startIcon={<i className="ri-mail-line" />}
                        {...register("email")}
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                    <Input
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        startIcon={<i className="ri-key-2-line"></i>}
                        endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}</span>}
                        {...register("password")}
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                </div>

                <Button type="submit"
                    disabled={!isValid || !isDirty || isSubmitting}
                    endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                    variant="defualt"
                    size="default"
                >
                    Sign-In
                </Button>

            </form>

            <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                Already have an account
                <Link className="pl-2 text-blue-500 underline underline-offset-4" to={"/sign-up"}>
                    Sign-In
                </Link>
            </p>
        </section>
    )
}
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { signUpSchema } from "../../lib/user.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/auth.store";
import { ApiResponse } from "../../types/axios.type";
import axios from "axios";

export default function SignUp() {
    const [visible, setVisible] = useState<boolean>(false);
    const { Signup } = useAuthStore((state) => state);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signUpSchema),
        mode: "all",
    });

    const submit = async ({ name, email, password }: { name: string, email: string, password: string }) => {
        try {
            const { data: { user, success } } = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/sign-up`, { name, email, password });

            if (success) {
                Signup(user);
                navigate(`/verifyemail/${user._id}`);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 items-center justify-center h-dvh select-none">
            <form className="w-[20rem] grid gap-5">
                <div>
                    <h1 className="text-3xl font-medium text-primary dark:text-white tracking-wider">
                        Join us today
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                        Join our community and start your journey today!
                    </p>
                </div>

                <div>
                    <Input
                        type="text"
                        placeholder="Name"
                        startIcon={<i className="ri-user-line" />}
                        {...register("name")}
                    />
                    {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
                </div>

                <div>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        startIcon={<i className="ri-mail-line" />}
                        {...register("email")}
                    />
                    {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
                </div>

                <div>
                    <Input
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        startIcon={<i className="ri-key-2-line"></i>}
                        endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}</span>}
                        {...register("password")}
                    />
                    {errors.password && <span className="text-sm text-red-400">{errors.password.message}</span>}
                </div>

                <Button type="submit"
                    disabled={!isValid || !isDirty || isSubmitting}
                    endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                    variant="defualt"
                    size="default"
                >
                    Sign-up
                </Button>

            </form>
            <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                Already have an account
                <Link className="pl-2 text-blue-500 underline underline-offset-4" to={"/sign-in"}>
                    Sign-In
                </Link>
            </p>
        </section>
    )
}
"use client";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { signUpSchema } from "../lib/user.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiEnvelope, BiKey, BiLoader, BiUser } from "react-icons/bi";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";
import { useAuthStore } from "../store/auth.store";

export default function SignUp() {
    const [visible, setVisible] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signUpSchema),
        mode: "all",
    });

    const { Signup } = useAuthStore((state) => state);

    const submit = async (data: { name: string, email: string, password: string }) => {
        Signup(data.name, data.email, data.password);
    }

    return (
        <main onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 items-center justify-center h-dvh select-none">
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
                        startIcon={<BiUser />}
                        {...register("name")}
                    />
                    {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
                </div>

                <div>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        startIcon={<BiEnvelope />}
                        {...register("email")}
                    />
                    {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
                </div>

                <div>
                    <Input
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        startIcon={<BiKey className="-rotate-45" />}
                        endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <PiEyeBold /> : <PiEyeClosed />}</span>}
                        {...register("password")}
                    />
                    {errors.password && <span className="text-sm text-red-400">{errors.password.message}</span>}
                </div>

                <Button type="submit"
                    disabled={!isValid || !isDirty || isSubmitting}
                    endIcon={isSubmitting && <BiLoader />}
                    variant={"defualt"}
                    size={"default"}
                >
                    Sign-In
                </Button>

            </form>
            <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                Already have an account
                <Link className="pl-2 text-blue-500 underline underline-offset-4" to={"/sign-in"}>
                    Sign-In
                </Link>
            </p>
        </main>
    )
}
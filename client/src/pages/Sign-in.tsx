import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { signInSchema } from "../lib/user.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiEnvelope, BiKey, BiLoader } from "react-icons/bi";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function SignIn() {
    const [visible, setVisible] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signInSchema),
        mode: "all",
    });


    const submit = async ({ email, password }: { email: string, password: string }) => {
        console.log(email, password);
    };

    return (
        <main className="flex flex-col gap-4 items-center justify-center h-dvh select-none">
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
                        startIcon={<BiEnvelope />}
                        {...register("email")}
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                    <Input
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        startIcon={<BiKey className="-rotate-45" />}
                        endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <PiEyeBold /> : <PiEyeClosed />}</span>}
                        {...register("password")}
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                </div>

                <Button type="submit"
                    disabled={!isValid || !isDirty || isSubmitting}
                    endIcon={isSubmitting && <BiLoader className="animate-spin" />}
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
        </main>
    )
}
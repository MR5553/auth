import { Button } from "../../components/Button";
import OtpBox from "../../components/Otp";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ApiResponse } from "../../types/axios.type";
import { FormEvent, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useTimer } from "../../hook/Timer";

export default function Verifyemail() {
    const [otp, setOpt] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { SignIn } = useAuthStore((state) => state);
    const param = useParams();
    const navigate = useNavigate();
    const { time, startTimer, isRunning } = useTimer(60);

    const handleResendVerificationCode = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-verification-code/${param.id}`);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const { data: { user, success } } = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/auth/verifyemail/${param.id}`, { otp: otp });

            if (success) {
                SignIn(user);
                navigate("/");
                setIsSubmitting(false);
            }

        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
        }
    }


    return (
        <section className="flex flex-col items-center justify-center h-dvh">
            <form onSubmit={handleSubmit} className="max-w-[20rem] flex flex-col gap-5 justify-center">
                <div>
                    <h1 className="text-3xl font-medium text-primary dark:text-white tracking-wider">
                        Verify your email
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                        please enter the 6-digit verification code that sent to your email
                    </p>
                </div>

                <OtpBox
                    length={6}
                    onChange={(otp: number) => setOpt(otp)}
                />

                <Button
                    type="submit"
                    variant="defualt"
                    size="default"
                    disabled={(otp <= 100000 || otp >= 999999) || isNaN(otp) || isSubmitting}
                >
                    Continue
                </Button>
            </form>

            <p className="mt-5 text-neutral-600 dark:text-neutral-400 font-normal">Didn't get the code?
                <Button
                    variant="link"
                    className="ml-2"
                    onClick={() => {
                        handleResendVerificationCode()
                        startTimer()
                    }}
                    disabled={isRunning}
                >
                    {isRunning ? time : "Resend it."}
                </Button>
            </p>
        </section>
    )
}
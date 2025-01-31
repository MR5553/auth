import { Button } from "../../components/Button";
import OtpBox from "../../components/Otp";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ApiResponse } from "../../types/axios.type";
import { FormEvent, useState } from "react";
import { useAuthStore } from "../../store/auth.store";

export default function Verifyemail() {
    const [otp, setOpt] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { VerifyEmail } = useAuthStore((state) => state);
    const param = useParams();
    const navigate = useNavigate();

    const handleResendVerificationCode = async () => {
        try {
            const { data } = await axios.post(`/api/auth/resend-verification-code/${param.id}`);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const { data: { user, success } } = await axios.post<ApiResponse>(`/api/auth/verifyemail/${param.id}`, { otp: otp });

            if (success) {
                VerifyEmail(user);
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
                    Verify OTP
                </Button>
            </form>

            <p className="mt-5 text-neutral-600 dark:text-neutral-400 font-normal">Didn't receive the code?
                <Button
                    variant="link"
                    className="ml-2"
                    onClick={handleResendVerificationCode}                >
                    Resend
                </Button>
            </p>
        </section>
    )
}
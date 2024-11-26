import { Button } from "../components/Button";
import OtpBox from "../components/Otp";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { ApiResponse } from "../types/axios.type";
import { useForm } from "react-hook-form";

export default function Verifyemail() {
    const { handleSubmit } = useForm();
    const param = useParams();

    const handleResendVerificationCode = async () => {
        try {
            const { data } = await axios.post(`/api/auth/resend-verification-code/${param.id}`);
            return data;
        } catch (error) {
            console.log(error);
        }
    }


    const Submit = async (data: unknown) => {
        try {
            return console.log(data);

            const res: AxiosResponse<ApiResponse> = await axios.post(`/api/auth/verifyemail/${param.id}`, { code: "" });

            return res;

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <main className="flex flex-col items-center justify-center h-dvh">
            <form onSubmit={handleSubmit(Submit)} className="w-[20rem] flex flex-col gap-5 justify-center">
                <h1 className="text-3xl font-medium text-primary dark:text-white tracking-wider">Verify your email</h1>
                <p className="text-neutral-600 dark:text-neutral-400 font-normal">
                    please enter the 6-digit verification code that sent to your email
                </p>

                <OtpBox length={6} onChange={(otp: number) => otp} />

                <Button
                    type="submit"
                    variant={"defualt"}
                    size={"default"}
                >
                    Verify OTP
                </Button>
            </form>

            <p className="mt-4 text-neutral-600 dark:text-neutral-400 font-normal">Didn&apos;t receive the code?
                <Button variant="link" className="ml-1" onClick={handleResendVerificationCode}>
                    Resend
                </Button>
            </p>
        </main>
    )
}
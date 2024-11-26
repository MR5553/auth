import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME!,
        pass: process.env.SMTP_PASSWORD!,
    },
    debug: true,
    tls: { rejectUnauthorized: false }
});

transporter.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});


export const EmailVerification = async (email: string, verificationCode: number) => {
    const info = await transporter.sendMail({
        from: "Techbyte",
        to: email,
        subject: "Verify your account",
        html: `
        <div
        style="font-family: Inter, SF Pro Display, Open Sans, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;background-color: #f5f5f5; max-width: 600px;margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <h1 style="color: #333333;">Welcome to TechByte!</h1>

        <p>Hi there!</p>

        <p style="color: #555555;">We're thrilled to have you join us at TechByte!</p>

        <p style="color: #555555;">
            Your verification code is: <strong style="letter-spacing: 2px; color: #000;">
            ${verificationCode}</strong>
        </p>

        <p style="color: #555555;">
            Please enter this code to activate your TechByte account and get
            started with the latest tech blogs and insights.

            If you have any questions or need assistance, feel free to reach out to our support team.

            We're excited to have you with us!
        </p>

        <p style="font-size: 14px;color: #888888;margin-top: 30px;">
            Thanks, <br>
            The TechByte Team
        </p>
    </div>
        `,
    });
    return info;
}
import nodemailer from "nodemailer";
import type { IEmailSender } from "../../../domain/interfaces/IEmailSender.service.js";



export class NodemailerEmailSender implements IEmailSender {

    private readonly transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendOtp(email: string,otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Verify your account",

            text: `
                Your verification OTP is: ${otp}

                This OTP will expire in 1 minutes.

                If you did not create this account, you can ignore this email.
            `.trim(),
        });
    }
}
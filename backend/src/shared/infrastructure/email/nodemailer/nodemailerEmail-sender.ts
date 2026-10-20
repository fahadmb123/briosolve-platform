import nodemailer from "nodemailer";
import type { IEmailSender } from "../../../application/interfaces/services/IEmailSender.service";



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
    async sendBlockEmail(email: string, reason: string): Promise<void> {
           
            const baseUrl = process.env.APP_URL || 'http://localhost:5173';
            const appealLink = `${baseUrl}/account/request`;

            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Important Notice: Your Account Has Been Suspended",
                text: `

        Hello,

        We are writing to inform you that your account has been suspended/blocked.

        Reason for action: ${reason}

        If you believe this is an error, you can submit an appeal request here:
        ${appealLink}

        Regards,
        Support Team
                `.trim(),
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #d9534f; margin-top: 0;">Account Suspended</h2>
            <p style="color: #333333; font-size: 16px;">Hello,</p>
            <p style="color: #333333; font-size: 16px;">We are writing to inform you that your account access has been restricted.</p>
            
            <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #f5c6cb;">
                <strong style="display: block; margin-bottom: 5px;">Reason for action:</strong>
                ${reason}
            </div>
            
            <p style="color: #333333; font-size: 14px; line-height: 1.5;">
                If you believe this is a mistake or wish to appeal this decision, please submit a request through our portal:
            </p>
            
            <a href="${appealLink}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin: 10px 0;">
                Submit Appeal Request
            </a>

            <p style="color: #555555; font-size: 12px; margin-top: 20px;">
                Or copy and paste this link into your browser: <br>
                <a href="${appealLink}" style="color: #007bff; word-break: break-all;">${appealLink}</a>
            </p>

            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="color: #555555; font-size: 14px;">
                Regards,<br>
                <strong>Support Team</strong>
            </p>
        </div>

            `.trim(),
        })
    }
    async sendActivationEmail(email: string): Promise<void> {
            const baseUrl = process.env.APP_URL || 'http://localhost:5173';
            const appealLink = `${baseUrl}/login`;
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Welcome! Please Activate Your Account",
                text: `
        Hello,

        Welcome to our platform! To complete your registration and activate your account, please visit the following link:
        ${appealLink}

        If you did not request this account, please safely ignore this email.

        Regards,
        Support Team
                `.trim(),
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #28a745; margin-top: 0;">Welcome Aboard!</h2>
            <p style="color: #333333; font-size: 16px;">Hello,</p>
            <p style="color: #333333; font-size: 16px;">Thank you for signing up. To complete your registration and activate your account, please click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${appealLink}" style="display: inline-block; background-color: #28a745; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                    Activate Account
                </a>
            </div>

            <p style="color: #555555; font-size: 14px; line-height: 1.5;">
                If the button doesn't work, you can copy and paste the following link into your browser:<br>
                <a href="${appealLink}" style="color: #007bff; word-break: break-all;">${appealLink}</a>
            </p>

            <p style="color: #777777; font-size: 12px; margin-top: 20px;">
                If you did not create an account with us, please safely ignore this email.
            </p>

            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="color: #555555; font-size: 14px;">
                Regards,<br>
                <strong>Support Team</strong>
            </p>
        </div>
                `.trim(),
            });
        }
    async sendSubmitRequest(email: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Request Received: We are reviewing your submission",
            text: `
                Hello,

                Thank you for reaching out to us. 

                We have successfully received your request. Our team is currently reviewing and analyzing the information you provided. 

                We will get back to you with an update as soon as possible. We appreciate your patience during this process.

                Regards,
                Support Team
                        `.trim(),
                        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #007bff; margin-top: 0;">Request Received</h2>
                    <p style="color: #333333; font-size: 16px;">Hello,</p>
                    <p style="color: #333333; font-size: 16px;">Thank you for reaching out. We are writing to confirm that we have successfully received your request.</p>
                    
                    <div style="background-color: #f8f9fa; color: #333333; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #007bff;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            Our support team is currently analyzing your submission. We will review the details and get back to you with more information as soon as possible.
                        </p>
                    </div>

                    <p style="color: #555555; font-size: 14px; line-height: 1.5;">
                        We appreciate your patience while we work on this. You will receive another email from us once there is an update.
                    </p>

                    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    
                    <p style="color: #555555; font-size: 14px;">
                        Regards,<br>
                        <strong>Support Team</strong>
                    </p>
                </div>
                        `.trim(),
            });
    }

    async sendRequestDeniedEmail(email: string, reason: string): Promise<void> {
        const baseUrl = process.env.APP_URL || 'http://localhost:5173';
        const appealLink = `${baseUrl}/account/request`;
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Update on Your Appeal: Request Denied",
            text: `
    Hello,

    Thank you for reaching out to us. We have reviewed your appeal request regarding your account status.

    After careful consideration, we regret to inform you that your request has been denied.

    Reason for denial: ${reason}

    Please note that this decision is final and your account will remain restricted.

    Regards,
    Support Team
            `.trim(),
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #d9534f; margin-top: 0;">Appeal Request Denied</h2>
        <p style="color: #333333; font-size: 16px;">Hello,</p>
        <p style="color: #333333; font-size: 16px;">Thank you for reaching out to us. We have thoroughly reviewed your recent appeal request regarding your account status.</p>
        
        <p style="color: #333333; font-size: 16px;">After careful consideration, we regret to inform you that your request has been <strong>denied</strong>.</p>
        
        <div style="background-color: #fdf5f5; color: #b71c1c; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #f5c6cb;">
            <strong style="display: block; margin-bottom: 5px;">Reason for denial:</strong>
            ${reason}
        </div>
        <a href="${appealLink}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin: 10px 0;">
                Submit Appeal Request
            </a>
        
        <p style="color: #333333; font-size: 14px; line-height: 1.5;">
            Please note that this decision is final in accordance with our platform's policies, and your account will remain restricted. We are unable to process further appeals for this action.
        </p>

        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <p style="color: #555555; font-size: 14px;">
            Regards,<br>
            <strong>Support Team</strong>
        </p>
    </div>
            `.trim(),
        });
    }
}
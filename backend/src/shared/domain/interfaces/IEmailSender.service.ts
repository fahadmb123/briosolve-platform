export interface IEmailSender {
    sendOtp(email: string,otp: string): Promise<void>
}
export interface EmailSender {
    sendOtp(email: string,otp: string): Promise<void>
}
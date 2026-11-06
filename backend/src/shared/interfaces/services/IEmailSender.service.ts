export interface IEmailSender {
    sendOtp(email: string,otp: string): Promise<void>,
    sendBlockEmail(email: string, reason: string): Promise<void>,
    sendActivationEmail(email: string): Promise<void>,
    sendSubmitRequest(email: string): Promise<void>,
    sendRequestDeniedEmail(email: string, reason: string): Promise<void>
}
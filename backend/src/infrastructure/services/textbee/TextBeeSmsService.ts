import { Textbee } from "@textbee/sdk";
import { ISmsService } from "../../../shared/domain/interfaces/ISms.service.js";


export class TextBeeSmsService implements ISmsService {
    private readonly textbee: Textbee;

    constructor() {
        this.textbee = new Textbee({
            apiKey: process.env.TEXTBEE_API_KEY!
        });
    }

    async sendOtp(phone: string, otp: string): Promise<void> {
        try {
            await this.textbee.sendSms({
                recipients: [phone],
                message: `OTP ${otp}`
            })
        } catch (error) {
            console.error("Failed to send SMS via TextBee:", error);
        }
    }
    
}

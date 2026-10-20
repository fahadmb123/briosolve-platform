import { Textbee } from "@textbee/sdk";
import { ISmsService } from "../../../shared/application/interfaces/services/ISms.service";
import { ApplicationError } from "../../../shared/application/errors/applicationError";


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
                message: `otp:${otp}`
            })
        } catch (error) {
            console.error("Failed to send SMS via TextBee:", error);
            throw new ApplicationError("FAILED_TO_SEND_SMS","Failed to send SMS","INTERNAL")
        }
    }
    
}

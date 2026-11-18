import Razorpay from "razorpay";
import crypto from "node:crypto";
import { envConfig } from "../../../../shared/config/env.config";
import { IRazorpayService, CreateOrderParams } from "../../domain/services/IRazorpayService";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class RazorpayService implements IRazorpayService {
    private _client: Razorpay | null = null;

    private getClient(): Razorpay {
        if (!this._client) {
            const keyId = envConfig.RAZORPAY_KEY_ID;
            const keySecret = envConfig.RAZORPAY_KEY_SECRET;

            if (!keyId || !keySecret) {
                throw new ApplicationError("CONFIGURATION_ERROR", "Razorpay credentials not configured in environment", "INTERNAL");
            }

            this._client = new Razorpay({
                key_id: keyId,
                key_secret: keySecret
            });
        }
        return this._client;
    }

    getKeyId(): string {
        return envConfig.RAZORPAY_KEY_ID || "";
    }

    async createOrder(params: CreateOrderParams): Promise<{ id: string; amount: number; currency: string }> {
        const client = this.getClient();

        const order = await client.orders.create({
            amount: params.amountInPaise,
            currency: params.currency,
            receipt: params.receipt,
            notes: params.notes
        });

        return {
            id: order.id,
            amount: Number(order.amount),
            currency: order.currency
        };
    }

    verifySignature(orderId: string, paymentId: string, signature: string): boolean {
        const keySecret = envConfig.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return false;
        }

        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");

        return expectedSignature === signature;
    }
}

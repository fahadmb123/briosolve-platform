import { GoogleGenAI } from "@google/genai";
import { ILlmAdapter } from "../../domain/adapters/ILlmAdapter";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { envConfig } from "../../../../shared/config/env.config";

export class GeminiLlmAdapter implements ILlmAdapter {
    private readonly _client: GoogleGenAI;
    private readonly _model: string;

    constructor(apiKey?: string, model?: string) {
        const key = apiKey || envConfig.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new ApplicationError("MISSING_AI_CONFIG", "Gemini API key is not configured", "INTERNAL");
        }
        this._client = new GoogleGenAI({ apiKey: key });
        this._model = model || envConfig.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
    }

    async generateJsonResponse<T>(systemPrompt: string, userPrompt: string): Promise<T> {
        try {
            const response = await this._client.models.generateContent({
                model: this._model,
                contents: userPrompt,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json",
                },
            });

            const text = response.text;
            if (!text) {
                throw new ApplicationError("AI_EMPTY_RESPONSE", "The AI model returned an empty response", "INTERNAL");
            }

            return JSON.parse(text) as T;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "AI generation failed";
            throw new ApplicationError("AI_GENERATION_FAILED", message, "INTERNAL");
        }
    }
}

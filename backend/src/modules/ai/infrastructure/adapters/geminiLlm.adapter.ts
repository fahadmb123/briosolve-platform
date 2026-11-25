import { GoogleGenAI } from "@google/genai";
import { ILlmAdapter } from "../../domain/adapters/ILlmAdapter";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { envConfig } from "../../../../shared/config/env.config";

export class GeminiLlmAdapter implements ILlmAdapter {
    private readonly _client: GoogleGenAI;
    private readonly _models: string[];

    constructor(apiKey?: string, model?: string) {
        const key = apiKey || envConfig.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new ApplicationError("MISSING_AI_CONFIG", "Gemini API key is not configured", "INTERNAL");
        }
        this._client = new GoogleGenAI({ apiKey: key });

        const preferred = model || envConfig.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
        const fallbackCandidates = [preferred, "gemini-3.5-flash-lite", "gemini-3.5-flash"];
        this._models = Array.from(new Set(fallbackCandidates.filter(Boolean)));
    }

    private _sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private _cleanJsonText(raw: string): string {
        let text = raw.trim();
        if (text.startsWith("```")) {
            text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        }
        return text;
    }

    async generateJsonResponse<T>(systemPrompt: string, userPrompt: string): Promise<T> {
        let lastError: unknown = null;

        for (const targetModel of this._models) {
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const response = await this._client.models.generateContent({
                        model: targetModel,
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

                    const cleaned = this._cleanJsonText(text);
                    return JSON.parse(cleaned) as T;
                } catch (error) {
                    lastError = error;
                    if (error instanceof ApplicationError && error.code === "AI_EMPTY_RESPONSE") {
                        break;
                    }

                    const errMsg = error instanceof Error ? error.message : String(error);
                    const isRetryable = errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");

                    if (isRetryable && attempt < 2) {
                        await this._sleep(1000);
                        continue;
                    }
                    break;
                }
            }
        }

        if (lastError instanceof ApplicationError) {
            throw lastError;
        }

        const rawMsg = lastError instanceof Error ? lastError.message : "AI generation failed";
        let friendlyMessage = "The AI evaluation service is temporarily unavailable. Please try again shortly.";
        if (rawMsg.includes("429") || rawMsg.includes("quota")) {
            friendlyMessage = "AI evaluation rate limit reached. Please wait a moment and try again.";
        }

        throw new ApplicationError("AI_GENERATION_FAILED", friendlyMessage, "INTERNAL");
    }
}

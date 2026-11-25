import { ILlmAdapter } from "../../domain/adapters/ILlmAdapter";
import { GeminiLlmAdapter } from "../adapters/geminiLlm.adapter";

export function createLlmAdapter(): ILlmAdapter {
    return new GeminiLlmAdapter();
}

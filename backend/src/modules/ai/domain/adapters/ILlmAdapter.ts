export interface ILlmAdapter {
    generateJsonResponse<T>(systemPrompt: string, userPrompt: string): Promise<T>;
}

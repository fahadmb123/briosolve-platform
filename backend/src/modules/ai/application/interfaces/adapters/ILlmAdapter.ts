export interface LlmGenerateOptions {
  systemPrompt: string;
  userPrompt: string;
}

export interface ILlmAdapter {
  generateResponse(options: LlmGenerateOptions): Promise<string>;
}
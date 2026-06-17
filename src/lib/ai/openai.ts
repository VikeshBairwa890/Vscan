import { ChatOpenAI } from "@langchain/openai";

const DEFAULT_MODEL = "gpt-4o-mini";
const PLACEHOLDER_KEYS = new Set([
  "your-openai-api-key",
  "sk-your-key",
  "sk-placeholder",
]);

export function isOpenAiConfigured(): boolean {
  const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!apiKey) return false;
  if (PLACEHOLDER_KEYS.has(apiKey)) return false;
  if (apiKey.includes("your-ope") || apiKey.includes("change-this")) return false;
  return apiKey.startsWith("sk-");
}

export function getOpenAiConfigError(): string | null {
  if (isOpenAiConfigured()) return null;
  return "OpenAI API key is missing or invalid. Set OPENAI_API_KEY in your .env file.";
}

export function getChatModel(temperature = 0.7) {
  const configError = getOpenAiConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const apiKey = process.env.OPENAI_API_KEY!.trim().replace(/^["']|["']$/g, "");

  return new ChatOpenAI({
    model: DEFAULT_MODEL,
    temperature,
    apiKey,
    timeout: 120000,
    maxRetries: 2,
  });
}

export function getModelName() {
  return DEFAULT_MODEL;
}

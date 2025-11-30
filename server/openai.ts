import OpenAI from "openai";

// Using blueprint:javascript_openai_ai_integrations
// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export { openai };

import OpenAI from 'openai';

export const openAiClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});
// export const openAiClient = new OpenAI({
//   baseURL: 'http://localhost:11434/v1',
//   apiKey: 'ollama',
// });

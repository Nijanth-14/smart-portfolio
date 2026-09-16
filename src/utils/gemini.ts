import { GoogleGenAI } from '@google/genai';

const MODELS_TO_TRY = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro'
];

export async function generateContentWithFallback(ai: any, prompt: string, config: any, mockResponse: any) {
  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`Attempting generation with ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });
      const content = response.text;
      if (!content) throw new Error("No content generated");
      return JSON.parse(content);
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error?.message || error);
      // If it's the last model, break out and use mock
      if (model === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
        console.error("All models failed. Falling back to mock data for demo reliability.");
      }
    }
  }
  
  // Hackathon Fallback: NEVER fail the demo!
  return mockResponse;
}

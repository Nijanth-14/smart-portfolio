import { GoogleGenAI } from '@google/genai';

const MODELS_TO_TRY = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro'
];

export async function generateContentWithFallback(ai: any, prompt: string, config: any, mockResponse: any) {
  const timeoutPromise = new Promise<any>((_, reject) => {
    setTimeout(() => reject(new Error("AI generation timed out (55s limit)")), 55000);
  });

  const generationPromise = async () => {
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
        
        // Extract the JSON object from the response, ignoring any surrounding markdown or conversational text
        const jsonStartIndex = content.indexOf('{');
        const jsonEndIndex = content.lastIndexOf('}');
        
        if (jsonStartIndex === -1 || jsonEndIndex === -1) {
          throw new Error("No valid JSON object found in response");
        }
        
        const sanitizedContent = content.substring(jsonStartIndex, jsonEndIndex + 1);
        
        return JSON.parse(sanitizedContent);
      } catch (error: any) {
        console.warn(`Model ${model} failed:`, error?.message || error);
        if (model === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
          console.error("All models failed.");
          throw new Error("All models failed");
        }
      }
    }
  };

  try {
    return await Promise.race([generationPromise(), timeoutPromise]);
  } catch (err: any) {
    console.error("Falling back to mock data for demo reliability due to:", err.message);
    return mockResponse;
  }
}

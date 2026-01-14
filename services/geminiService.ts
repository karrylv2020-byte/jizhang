import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert nutritionist and food scientist AI. 
Your task is to analyze images of food provided by the user.
Identify the food items, estimate the serving size based on visual cues, and calculate the nutritional content.
Be realistic with portion sizes. If the image contains multiple items, sum them up or list the main components.
Provide a health score from 1 (unhealthy) to 10 (very healthy) and actionable health tips.

IMPORTANT: Respond in Simplified Chinese (简体中文). All names, descriptions, and tips must be in Chinese.
`;

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<FoodAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this food image. Provide nutritional estimation in Simplified Chinese.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "食物名称 (中文)" },
            description: { type: Type.STRING, description: "简短的食物描述和份量估算 (中文)" },
            totalCalories: { type: Type.NUMBER, description: "总卡路里 (kcal)" },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER, description: "蛋白质 (克)" },
                carbs: { type: Type.NUMBER, description: "碳水化合物 (克)" },
                fat: { type: Type.NUMBER, description: "脂肪 (克)" },
                fiber: { type: Type.NUMBER, description: "膳食纤维 (克)" },
              },
              required: ["protein", "carbs", "fat", "fiber"],
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "成分名称 (中文)" },
                  calories: { type: Type.NUMBER },
                },
                required: ["name", "calories"],
              },
            },
            healthScore: { type: Type.NUMBER, description: "健康评分 1-10" },
            healthTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "健康建议 (中文)",
            },
          },
          required: ["foodName", "description", "totalCalories", "macros", "ingredients", "healthScore", "healthTips"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No data returned from Gemini.");
    }

    return JSON.parse(resultText) as FoodAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
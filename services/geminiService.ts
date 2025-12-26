import { GoogleGenAI, Type } from "@google/genai";
import { SupplementData, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean JSON string if Markdown code blocks are present
const cleanJsonString = (str: string): string => {
  if (str.startsWith('```json')) {
    return str.replace(/^```json\n/, '').replace(/\n```$/, '');
  }
  if (str.startsWith('```')) {
    return str.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  return str;
};

export const analyzeSupplementImage = async (base64Image: string): Promise<SupplementData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this supplement product image. Identify the product name, brand, and key ingredients. 
            Provide a scientific review based on clinical consensus.
            
            Return the result strictly as a JSON object matching this schema:
            {
              "productName": "string",
              "brand": "string",
              "description": "string",
              "ingredients": [
                { "name": "string", "efficacyRating": "High/Moderate/Low/Unproven", "safetyRating": "Safe/Caution/Unsafe", "description": "string" }
              ],
              "scientificResearch": "string (summary of studies)",
              "safetyConsiderations": "string (drug interactions, contraindications)",
              "recommendedDosage": "string",
              "qualityAssessment": "string (strength of evidence)",
              "overallVerdict": "string"
            }`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            brand: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  efficacyRating: { type: Type.STRING },
                  safetyRating: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            scientificResearch: { type: Type.STRING },
            safetyConsiderations: { type: Type.STRING },
            recommendedDosage: { type: Type.STRING },
            qualityAssessment: { type: Type.STRING },
            overallVerdict: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SupplementData;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const searchSupplementDatabase = async (query: string): Promise<SupplementData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search for supplements matching "${query}". Provide detailed scientific profiles for the top 1 to 3 matches.
      
      Return a JSON array of objects. Each object must follow this structure:
      {
         "productName": "string",
         "brand": "string",
         "description": "string",
         "ingredients": [],
         "scientificResearch": "string",
         "safetyConsiderations": "string",
         "recommendedDosage": "string",
         "qualityAssessment": "string",
         "overallVerdict": "string"
      }`,
       config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              brand: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    efficacyRating: { type: Type.STRING },
                    safetyRating: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              },
              scientificResearch: { type: Type.STRING },
              safetyConsiderations: { type: Type.STRING },
              recommendedDosage: { type: Type.STRING },
              qualityAssessment: { type: Type.STRING },
              overallVerdict: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SupplementData[];
  } catch (error) {
    console.error("Error searching database:", error);
    return [];
  }
};

export const getConsultantResponse = async (history: ChatMessage[], userMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert AI Clinical Nutritionist and Supplement Consultant. 
        Your goal is to help users make informed decisions. 
        Ask relevant questions about health goals (energy, sleep, muscle, stress), medications, age, and lifestyle if not provided.
        Provide evidence-based recommendations. Always mention safety warnings and disclaimer that you are an AI, not a doctor.
        Keep responses concise, friendly, and structured. Use Markdown for readability.`
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again.";
  }
};

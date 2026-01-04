
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDeepExplanation = async (
  question: string, 
  userAnswer: string, 
  correctAnswer: string,
  speciesInfo?: string
) => {
  try {
    const infoContext = speciesInfo ? `Lajin erityispiirteitä: ${speciesInfo}.` : "";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Toimi kokeneena metsästyskouluttajana. Oppilas vastasi kysymykseen: "${question}". 
      Hän valitsi vastauksen: "${userAnswer}". Oikea vastaus on: "${correctAnswer}".
      ${infoContext}
      Selitä lyhyesti ja kannustavasti (max 3 lausetta), miksi oikea vastaus on oikea ja mitä oppilaan tulisi huomioida maastossa välttääkseen virheen tai sekaannuksen samankaltaisiin lajeihin. 
      Käytä asiallista mutta käytännönläheistä kieltä.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Hups, selityksen haku epäonnistui. Luota oppikirjaan!";
  }
};

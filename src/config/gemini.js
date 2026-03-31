import { GoogleGenAI } from "@google/genai";

// Switching to Gemini 2.0 Flash to resolve production 404 errors 
// seen with certain API keys/regions on the 1.5 tier.
const MODEL_NAME = "gemini-2.0-flash"; 

// Using Vite environment variable for security
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Lazy initialization for production resilience
let ai;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
             if (reader.result) {
                const base64data = reader.result.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64data,
                        mimeType: file.type,
                    },
                });
             }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const runChat = async (chatHistory, selectedImage = null) => {
    try {
        if (!API_KEY) {
             throw new Error("API Key mission. Ensure VITE_GEMINI_API_KEY is set in your Hosting Environment Variables.");
        }
        
        if (!ai) {
            ai = new GoogleGenAI({ apiKey: API_KEY });
        }

        const latestPrompt = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";
        let response;
        
        if (selectedImage) {
            const imagePart = await fileToGenerativePart(selectedImage);
            response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: [
                    { text: latestPrompt },
                    imagePart
                ]
            });
        } else {
            response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: latestPrompt
            });
        }

        const responseText = response.text;
        console.log("Gemini 2.0 Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat:", error);
        throw error;
    }
};

export default runChat;
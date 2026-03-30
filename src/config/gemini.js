import { GoogleGenAI } from "@google/genai";

// Standardizing to 'gemini-flash-latest' for cross-version compatibility
const MODEL_NAME = "gemini-flash-latest"; 

// Using Vite environment variable for security
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize using the GoogleGenAI SDK as per user snippet
const ai = new GoogleGenAI({ apiKey: API_KEY });

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
            throw new Error("Missing API Key. Please ensure VITE_GEMINI_API_KEY is defined in your local .env file.");
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
            // Stable text call using the @google/genai SDK pattern
            response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: latestPrompt
            });
        }

        const responseText = response.text;
        console.log("Gemini Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat:", error);
        throw error;
    }
};

export default runChat;
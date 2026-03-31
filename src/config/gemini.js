import { GoogleGenAI } from "@google/genai";

// Standardizing strictly on Gemini 3 Flash Preview as per latest documentation
const MODEL_NAME = "gemini-3-flash-preview"; 

// Using Vite environment variable for security
// Ensure VITE_GEMINI_API_KEY is defined in your local .env or Vercel dashboard
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize using the GoogleGenAI SDK pattern
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
             throw new Error("Missing API Key. Please add VITE_GEMINI_API_KEY to your Vercel Environment Variables.");
        }
        
        if (!ai) {
            ai = new GoogleGenAI({ apiKey: API_KEY });
        }

        const latestPrompt = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";
        let response;
        
        // As per Gemini 3 documentation, we'll use the simplified text-only contents if no image
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
        console.log("Gemini 3 Flash Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat (Gemini 3):", error);
        throw error;
    }
};

export default runChat;
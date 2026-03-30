import { GoogleGenAI } from "@google/genai";

// Use the exact model name and SDK from the user's latest documentation
const MODEL_NAME = "gemini-3-flash-preview"; 

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDjQkvq4XAtCIcGlQweLNzD2Wk_c9X061E";

// Initialize using the new GoogleGenAI class as per user snippet
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
        const latestPrompt = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";
        
        let response;
        
        if (selectedImage) {
            // New SDK structure for multimodal
            const imagePart = await fileToGenerativePart(selectedImage);
            response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: [
                    { text: latestPrompt },
                    imagePart
                ]
            });
        } else {
            // Simple text contents as per user snippet
            response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: latestPrompt
            });
        }

        // The newest SDK returns the text property as per the user's snippet
        const responseText = response.text;

        console.log("Gemini 3 Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat (Gemini 3):", error);
        throw error;
    }
};

export default runChat;
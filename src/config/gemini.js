import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// If "gemini-1.5-flash" returns 404, we'll try the newest 2.0 version.
// "gemini-2.0-flash" is the latest model standard.
const MODEL_NAME = "gemini-2.0-flash"; 

// Using Vite environment variable for security
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDjQkvq4XAtCIcGlQweLNzD2Wk_c9X061E";

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
        if (!API_KEY || API_KEY.includes("YOUR_")) {
             throw new Error("Missing API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Note: Initializing the model. 
        // We'll use 2.0 Flash as it's the current experimental/pro-tier default for some keys.
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048, // Reduced for faster Flash responses
            responseMimeType: "text/plain",
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        // Process message list for 2.0 Flash compatibility
        const history = chatHistory
            .filter((item, index) => index < chatHistory.length - 1)
            .map((item) => ({
                role: item.role === "user" ? "user" : "model",
                parts: [{ text: item.content }],
            }));

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history,
        });

        const latestPrompt = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";

        let content = [latestPrompt];
        if (selectedImage) {
            const imagePart = await fileToGenerativePart(selectedImage);
            content.push(imagePart);
        }

        const result = await chat.sendMessage(content);
        const responseText = result.response.text();

        console.log("Gemini Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat:", error);
        throw error;
    }
};

export default runChat;
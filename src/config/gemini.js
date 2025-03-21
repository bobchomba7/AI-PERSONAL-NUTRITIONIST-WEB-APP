import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyA9a-X6h-pqMF5Kbwbbvcl9Kfv9zxoHa0A";

const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const runChat = async (chatHistory, selectedImage = null) => {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
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

        // Map chatHistory to Gemini API's history format
        const history = chatHistory
            .filter((item, index) => index < chatHistory.length - 1) // Exclude the latest user prompt
            .map((item) => ({
                role: item.role === "user" ? "user" : "model",
                parts: item.imageUrl && item.role === "user"
                    ? [{ text: item.content }, { inlineData: { data: item.imageUrl, mimeType: "image/jpeg" } }]
                    : [{ text: item.content }],
            }));

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history,
        });

        const latestPrompt = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";

        const content = selectedImage
            ? [latestPrompt, await fileToGenerativePart(selectedImage)]
            : [latestPrompt];

        const result = await chat.sendMessage(content);
        const response = result.response;
        const responseText = response.text();

        console.log("Gemini Response:", responseText);
        return responseText || "No response";
    } catch (error) {
        console.error("Error in runChat:", error);
        throw error;
    }
};

export default runChat;
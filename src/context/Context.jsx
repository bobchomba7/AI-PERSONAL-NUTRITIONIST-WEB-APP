import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { saveChat, getChats, uploadImage } from "../config/firebase";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchChats(user.uid);
            } else {
                setUser(null);
                setChatHistory([]);
                setPrevPrompts([]);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const fetchChats = async (userId) => {
        const chats = await getChats(userId);
        setPrevPrompts(chats);
    };

    const loadChatHistory = (chat) => {
        // Load a previous chat into chatHistory
        const history = [
            { role: "user", content: chat.prompt, imageUrl: chat.imageUrl || null },
            { role: "assistant", content: chat.response, imageUrl: null },
        ];
        setChatHistory(history);
        setCurrentChatId(chat.id || Date.now().toString());
        setShowResult(true);
        setResultData(chat.response); // Set resultData to display the AI response immediately
        setRecentPrompt(chat.prompt);
    };

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setImagePreview(null);
        setChatHistory([]);
        setRecentPrompt("");
        setResultData("");
        setCurrentChatId(Date.now().toString());
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let userMessage = prompt || input;
        let imageUrl = null;

        if (selectedImage && user) {
            try {
                imageUrl = await uploadImage(user.uid, selectedImage);
            } catch (error) {
                console.error("Failed to upload image:", error);
                setResultData("Error uploading image. Please try again.");
                setLoading(false);
                return;
            }
        }

        setChatHistory((prev) => [
            ...prev,
            { role: "user", content: userMessage, imageUrl: imageUrl || null },
        ]);

        let response;
        try {
            response = await runChat(chatHistory.concat({ role: "user", content: userMessage, imageUrl }), selectedImage);
            setRecentPrompt(userMessage);

            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }

            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");

            setChatHistory((prev) => [
                ...prev,
                { role: "assistant", content: newResponse2, imageUrl: null },
            ]);

            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }

            if (user) {
                const chatData = {
                    id: currentChatId || Date.now().toString(),
                    prompt: userMessage,
                    response: newResponse2,
                    imageUrl: imageUrl || null,
                };
                await saveChat(user.uid, chatData);
                setPrevPrompts((prev) => [...prev, chatData]);
            }
        } catch (error) {
            console.error("Error in onSent:", error);
            setResultData("Sorry, an error occurred. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
            setSelectedImage(null);
            setImagePreview(null);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setChatHistory([]);
            setCurrentChatId(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Context.Provider value={{
            prevPrompts,
            setPrevPrompts,
            onSent,
            setRecentPrompt,
            recentPrompt,
            showResult,
            loading,
            resultData,
            input,
            setInput,
            newChat,
            selectedImage,
            handleImageUpload,
            imagePreview,
            user,
            logout,
            chatHistory,
            loadChatHistory,
            currentChatId,
        }}>
            {!authLoading && props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
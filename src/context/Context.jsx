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
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [extended, setExtended] = useState(window.innerWidth > 1024); // Shared sidebar state

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchChats(currentUser.uid);
                
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const { db } = await import("../config/firebase");
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (err) {
                    console.error("Error fetching username:", err);
                }
            } else {
                setUser(null);
                setUserData(null);
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
        const history = [
            { role: "user", content: chat.prompt, imageUrl: chat.imageUrl || null },
            { role: "assistant", content: chat.response, imageUrl: null },
        ];
        setChatHistory(history);
        setCurrentChatId(chat.id || Date.now().toString());
        setShowResult(true);
        setResultData(chat.response);
        setRecentPrompt(chat.prompt);
        // Auto-close sidebar on load if mobile
        if (window.innerWidth <= 768) setExtended(false);
    };

    const formatResponse = (text) => {
        if (!text) return "";
        return text
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
    };

    const clearImagePreview = () => {
        setSelectedImage(null);
        setImagePreview(null);
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

        try {
            const response = await runChat(
                chatHistory.concat({ role: "user", content: userMessage, imageUrl }),
                selectedImage
            );

            setRecentPrompt(userMessage);
            const formattedResponse = formatResponse(response);

            setChatHistory((prev) => [
                ...prev,
                { role: "assistant", content: formattedResponse, imageUrl: null },
            ]);

            setResultData(formattedResponse);

            if (user) {
                const chatData = {
                    id: currentChatId || Date.now().toString(),
                    prompt: userMessage,
                    response: formattedResponse,
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

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setImagePreview(null);
        setChatHistory([]);
        setRecentPrompt("");
        setResultData("");
        setCurrentChatId(Date.now().toString());
        if (window.innerWidth <= 768) setExtended(false);
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
            setUserData(null);
            setChatHistory([]);
            setCurrentChatId(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Context.Provider
            value={{
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
                clearImagePreview,
                user,
                userData,
                logout,
                chatHistory,
                loadChatHistory,
                currentChatId,
                darkMode,
                setDarkMode,
                extended,
                setExtended
            }}
        >
            {!authLoading && props.children}
        </Context.Provider>
    );
};

export default ContextProvider;

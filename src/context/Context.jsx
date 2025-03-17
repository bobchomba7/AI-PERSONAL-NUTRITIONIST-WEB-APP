import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { saveChat, getChats } from "../config/firebase";

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

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchChats(user.uid);
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const fetchChats = async (userId) => {
        const chats = await getChats(userId);
        setPrevPrompts(chats);
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
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt, selectedImage);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input, selectedImage);
        }

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
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        if (user) {
            await saveChat(user.uid, { prompt: recentPrompt, response: newResponse2 });
        }

        setLoading(false);
        setInput("");
        setSelectedImage(null);
        setImagePreview(null);
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
            setUser(null); // Manually update user state
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
            logout, // Add logout function to context value
        }}>
            {!authLoading && props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
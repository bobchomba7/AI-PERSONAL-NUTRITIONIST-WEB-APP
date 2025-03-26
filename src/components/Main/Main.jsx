import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";  // Import navigation
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { db } from "../../config/firebase";
import { updateDoc, doc, increment } from "firebase/firestore";

const Main = () => {
    const navigate = useNavigate();  // Initialize navigation
    const { onSent, setInput, input, handleImageUpload, user, chatHistory, showResult } = useContext(Context);

    const updateUserStats = async (field) => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userRef, {
                [`stats.${field}`]: increment(1),
            });
        } catch (error) {
            console.error("Error updating user stats:", error);
        }
    };

    const handleSendMessage = () => {
        if (input.trim() !== "") {
            onSent();
            updateUserStats("chatInteractions");
            setInput("");
        }
    };

    const handleImageUploadAndUpdate = async (event) => {
        await handleImageUpload(event);
        updateUserStats("imagesUploaded");
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>AI Nutritionist</p>
                <img
                    src={assets.user_icon}
                    alt="User Profile"
                    className="profile-icon"
                    onClick={() => navigate("/profile")}  // Navigate to profile page on click
                />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello {user ? user.displayName || user.email : 'Guest'}</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card">
                                <p>Suggest healthy recipe</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Suggest healthy diet</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Suggest healthy meal plan</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Suggest healthy drinks</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        <div className="result-data">
                            {chatHistory.map((message, index) => (
                                <div key={index} className={message.role === "user" ? "user-message" : "ai-message"}>
                                    {message.role === "assistant" && <img src={assets.gemini_icon} alt="" />}
                                    <div className="message-content">
                                        <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
                                        {message.imageUrl && <img src={message.imageUrl} alt="Uploaded" className="uploaded-image" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Enter question here" />
                        <div>
                            <input type="file" accept="image/*" onChange={handleImageUploadAndUpdate} style={{ display: 'none' }} id="fileInput" />
                            <label htmlFor="fileInput">
                                <img src={assets.gallery_icon} alt="Upload" />
                            </label>
                            {input ? <img onClick={handleSendMessage} src={assets.send_icon} alt="Send" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        This information is for consultation purposes only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;

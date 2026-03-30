import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { db, auth } from "../../config/firebase";
import { updateDoc, doc, increment, getDoc } from "firebase/firestore";

const Main = () => {
    const navigate = useNavigate();
    const { onSent, setInput, input, handleImageUpload, user, userData, chatHistory, showResult, imagePreview, darkMode, setDarkMode } = useContext(Context);

    // Profile data and image fetching COMPLETELY removed per user request
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

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
        if (input.trim() !== "" || imagePreview) {
            onSent();
            updateUserStats("chatInteractions");
            setInput("");
        }
    };

    const handleImageUploadAndUpdate = async (event) => {
        await handleImageUpload(event);
        updateUserStats("imagesUploaded");
    };

    const displayName = userData?.username || (user ? user.displayName || user.email.split('@')[0] : 'Guest');

    return (
        <div className={`main ${darkMode ? 'dark-mode' : ''}`}>
            <div className="nav">
                <div className="nav-left">
                    <button className="theme-toggle modern-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>

                <div className="nav-center">
                    <p className="app-title-main">NUTRI-AI</p>
                </div>

                <div className="nav-right">
                    {/* Profile picture icon and route COMPLETELY removed */}
                    <div className="user-welcome-nav">
                        <span className="user-name">Welcome, {displayName}!</span>
                    </div>
                </div>
            </div>

            <div className="main-container">
                {!showResult ? (
                    <div className="welcome-screen">
                        <div className="greet">
                            <p><span>Hi, {displayName}</span></p>
                            <p className="subtitle">Where should we start?</p>
                        </div>
                        <div className="cards-center-wrapper">
                            <div className="cards smaller-centered-cards">
                                <div className="card" onClick={() => setInput("Suggest a healthy recipe for dinner")}>
                                    <p>Suggest a healthy recipe for dinner</p>
                                    <div className="card-icon"><img src={assets.bulb_icon} alt="bulb" /></div>
                                </div>
                                <div className="card" onClick={() => setInput("What's a balanced diet for weight loss?")}>
                                    <p>What's a balanced diet for weight loss?</p>
                                    <div className="card-icon"><img src={assets.bulb_icon} alt="bulb" /></div>
                                </div>
                                <div className="card" onClick={() => setInput("Create a 7-day meal plan for my health")}>
                                    <p>Create a 7-day meal plan for my health</p>
                                    <div className="card-icon"><img src={assets.bulb_icon} alt="bulb" /></div>
                                </div>
                                <div className="card" onClick={() => setInput("Healthy hydrating drinks for this week")}>
                                    <p>Healthy hydrating drinks for this week</p>
                                    <div className="card-icon"><img src={assets.bulb_icon} alt="bulb" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chat-container">
                        <div className="result-data">
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`message-wrapper ${message.role === "user" ? "user-wrapper" : ""}`}>
                                    {message.role === "assistant" && (
                                        <div className="ai-avatar">
                                            <img src={assets.gemini_icon} alt="AI" className="ai-icon-small" />
                                        </div>
                                    )}
                                    <div className={`message-bubble ${message.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                                        <div className="message-content">
                                            <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                                            {message.imageUrl && (
                                                <div className="image-attachment">
                                                    <img src={message.imageUrl} alt="Uploaded" className="uploaded-image" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="input-area">
                        {imagePreview && (
                            <div className="image-preview-overlay">
                                <img src={imagePreview} alt="Preview" />
                                <button className="remove-preview" onClick={() => onSent(null, true)}>×</button>
                            </div>
                        )}

                        <div className="search-box">
                            <input
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                type="text"
                                placeholder="Enter a prompt here..."
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <div className="input-actions">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUploadAndUpdate}
                                    style={{ display: 'none' }}
                                    id="fileInput"
                                />
                                <label htmlFor="fileInput" className="action-btn" title="Upload Image">
                                    <img src={assets.gallery_icon} alt="Upload" />
                                </label>
                                {(input.trim() || imagePreview) && (
                                    <button
                                        onClick={handleSendMessage}
                                        className="send-btn"
                                    >
                                        <img src={assets.send_icon} alt="Send" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="bottom-info">
                            NUTRI-AI may display inaccurate info, including about people, so double-check its responses.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;

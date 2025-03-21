import React, { useContext } from "react";
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData,
        setInput, input, handleImageUpload, user, chatHistory } = useContext(Context);

    return (
        <div className='main'>
            <div className="nav">
                <p>AI Nutritionist</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello {user ? user.displayName || user.email : 'Guest'}</span></p>
                            <p>How can I help you today</p>
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
                                        {/* Use resultData for the latest AI response with typing effect, otherwise use message.content */}
                                        {message.role === "assistant" && index === chatHistory.length - 1 && loading ? (
                                            <div className="loader">
                                                <hr />
                                                <hr />
                                                <hr />
                                            </div>
                                        ) : message.role === "assistant" && index === chatHistory.length - 1 ? (
                                            <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                        ) : (
                                            <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
                                        )}
                                        {message.imageUrl && (
                                            <img src={message.imageUrl} alt="Uploaded" className="uploaded-image" />
                                        )}
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
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="fileInput" />
                            <label htmlFor="fileInput">
                                <img src={assets.gallery_icon} alt="Upload" />
                            </label>
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="Send" /> : null}
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
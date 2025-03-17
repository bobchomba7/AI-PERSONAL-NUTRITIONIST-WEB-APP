import React, { useContext } from "react";
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";


const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData,
        setInput, input, handleImageUpload, imagePreview, user } = useContext(Context);

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
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <>
                                    <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                    {imagePreview && <img src={imagePreview} alt="Uploaded" className="uploaded-image" />}
                                </>
                            )}
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

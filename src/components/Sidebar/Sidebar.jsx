import React, { useContext, useState } from "react";
import './Sidebar.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompts, setRecentPrompt, newChat, logout } = useContext(Context);
    const navigate = useNavigate();

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from Context
            navigate('/login'); // Redirect to login page after successful logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New chat</p> : null}
                </div>
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => {
                            const promptText = typeof item === 'string' ? item : item.prompt;
                            return (
                                <div key={index} onClick={() => loadPrompt(promptText)} className="recent-entry">
                                    <img src={assets.message_icon} alt="" />
                                    <p>{promptText.slice(0, 25)}..</p>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry" onClick={handleLogout}>
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>LOGOUT</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
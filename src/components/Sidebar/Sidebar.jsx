import React, { useContext, useState } from "react";
import './Sidebar.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { prevPrompts, newChat, logout, loadChatHistory } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="menu" />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="new chat" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => {
                            const promptText = typeof item === 'string' ? item : item.prompt;
                            return (
                                <div key={index} onClick={() => loadChatHistory(item)} className="recent-entry">
                                    <img src={assets.message_icon} alt="message" />
                                    <p>{promptText.slice(0, 20)}..</p>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
            
            <div className="bottom">
                <div className="bottom-item recent-entry" onClick={() => navigate('/dashboard')}>
                    <img src={assets.history_icon} alt="dashboard" /> {/* Using history_icon for Dashboard */}
                    {extended ? <p>Dashboard</p> : null}
                </div>
                <div className="bottom-item recent-entry" onClick={handleLogout}>
                    <img src={assets.history_icon} alt="logout" />
                    {extended ? <p>LOGOUT</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

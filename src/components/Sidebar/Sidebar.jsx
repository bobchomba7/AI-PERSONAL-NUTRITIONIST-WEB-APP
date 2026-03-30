/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    // Shared state from Context
    const { extended, setExtended, prevPrompts, newChat, logout, loadChatHistory } = useContext(Context);
    
    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth > 1024 ? 280 : 0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarWidth(extended ? 280 : 68);
            } else {
                setSidebarWidth(extended ? 250 : 0);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [extended]);

    const toggleSidebar = () => {
        setExtended(!extended);
    };

    return (
        <div 
            className={`sidebar ${extended ? "extended" : ""} ${isMobile ? "mobile-sidebar" : ""}`} 
            style={{ width: isMobile ? (extended ? "250px" : "0") : (extended ? "280px" : "68px") }}
        >
            <div className="top">
                <div className="sidebar-header">
                    <div onClick={toggleSidebar} className="menu-desktop">
                        <img
                            src={assets.menu_icon}
                            alt="menu"
                            className="menu-icon-img"
                        />
                        {extended && <h2 className="logo-text">HISTORY</h2>}
                    </div>
                </div>

                <div onClick={newChat} className="new-chat-container">
                    <div className="new-chat">
                        <img src={assets.plus_icon} alt="new chat" />
                        {extended ? <p>New Chat</p> : null}
                    </div>
                </div>

                {extended && (
                    <div className="recent">
                        <p className="recent-title">History</p>
                        <div className="recent-list">
                            {prevPrompts.map((item, index) => (
                                <div key={index} onClick={() => loadChatHistory(item)} className="recent-entry">
                                    <p>{(typeof item === 'string' ? item : item.prompt).slice(0, 18)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bottom">
                <div className="bottom-item" onClick={() => navigate("/dashboard")} title="Dashboard">
                    <img src={assets.compass_icon} alt="dashboard" />
                    {extended ? <p>Dashboard</p> : null}
                </div>
                <div className="bottom-item logout-item" onClick={async () => { await logout(); navigate("/login"); }} title="Logout">
                    <img src={assets.exit_icon} alt="logout" />
                    {extended ? <p>Logout</p> : null}
                </div>
            </div>
            
            {isMobile && extended && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default Sidebar;
